package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.MediaResponseDTO;
import com.ame_ypd_backend.entity.Media;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Allowed file types — whitelist approach is safer than blacklist
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final List<String> ALLOWED_VIDEO_TYPES = List.of(
        "video/mp4", "video/mpeg", "video/quicktime"
    );
    private static final List<String> ALLOWED_DOC_TYPES = List.of(
        "application/pdf"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public MediaResponseDTO uploadFile(
            MultipartFile file,
            String title,
            String description,
            String uploadedBy,
            Media.MediaCategory category) throws IOException {

        // ── Security Check 1: File must not be empty ──────────────
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        // ── Security Check 2: File size limit ─────────────────────
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }

        // ── Security Check 3: Validate content type (whitelist) ───
        String contentType = file.getContentType();
        List<String> allAllowed = new ArrayList<>();
        allAllowed.addAll(ALLOWED_IMAGE_TYPES);
        allAllowed.addAll(ALLOWED_VIDEO_TYPES);
        allAllowed.addAll(ALLOWED_DOC_TYPES);

        if (contentType == null || !allAllowed.contains(contentType)) {
            throw new RuntimeException(
                "File type not allowed. Only images, videos and PDFs are accepted.");
        }

        // ── Security Check 4: Path traversal prevention ───────────
        // NEVER use the original filename for storage
        // UUID makes it impossible to predict or target filenames
        String originalFileName = file.getOriginalFilename();
        String fileExtension = sanitizeExtension(
            getFileExtension(originalFileName), contentType);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        // Resolve and normalize path — prevents ../../ attacks
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(storedFileName).normalize();

        // Final check — ensure resolved path is still inside upload directory
        if (!filePath.startsWith(uploadPath)) {
            throw new RuntimeException("Invalid file path detected");
        }

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(file.getInputStream(), filePath,
            StandardCopyOption.REPLACE_EXISTING);

        Media.MediaType mediaType = determineMediaType(contentType);

        Media media = new Media();
        media.setFileName(sanitizeFileName(originalFileName)); // Sanitize display name
        media.setStoredFileName(storedFileName);
        media.setFileUrl("/api/v1/media/files/" + storedFileName);
        media.setFileType(contentType);
        media.setFileSize(file.getSize());
        media.setMediaType(mediaType);
        media.setCategory(category != null ? category : Media.MediaCategory.GENERAL);
        media.setTitle(title != null ? title : sanitizeFileName(originalFileName));
        media.setDescription(description);
        media.setUploadedBy(uploadedBy);

        return new MediaResponseDTO(mediaRepository.save(media));
    }

    // Only allow safe extensions matching the content type
    private String sanitizeExtension(String extension, String contentType) {
        Map<String, String> safeExtensions = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/gif", ".gif",
            "image/webp", ".webp",
            "video/mp4", ".mp4",
            "video/mpeg", ".mpeg",
            "video/quicktime", ".mov",
            "application/pdf", ".pdf"
        );
        return safeExtensions.getOrDefault(contentType, ".bin");
    }

    // Remove dangerous characters from display filename
    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unnamed";
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    // Save a YouTube video reference — no file upload needed
    public MediaResponseDTO saveYoutubeVideo(
            String youtubeVideoId,
            String title,
            String description,
            String uploadedBy,
            Media.MediaCategory category) {

        Media media = new Media();
        media.setYoutubeVideoId(youtubeVideoId);
        // YouTube thumbnail URL is always this format
        media.setYoutubeThumbnail(
            "https://img.youtube.com/vi/" + youtubeVideoId + "/hqdefault.jpg");
        media.setIsYoutubeVideo(true);
        media.setFileUrl(
            "https://www.youtube.com/watch?v=" + youtubeVideoId);
        media.setMediaType(Media.MediaType.VIDEO);
        media.setTitle(title);
        media.setDescription(description);
        media.setUploadedBy(uploadedBy);
        media.setCategory(category != null ? category : Media.MediaCategory.GENERAL);
        media.setFileName(title); // Use title as filename for YouTube videos

        return new MediaResponseDTO(mediaRepository.save(media));
    }

    // Get all media
    public List<MediaResponseDTO> getAllMedia() {
        return mediaRepository.findAll()
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get by type (IMAGE or VIDEO)
    public List<MediaResponseDTO> getByType(Media.MediaType mediaType) {
        return mediaRepository
            .findByMediaTypeOrderByUploadedAtDesc(mediaType)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get by category
    public List<MediaResponseDTO> getByCategory(Media.MediaCategory category) {
        return mediaRepository
            .findByCategoryOrderByUploadedAtDesc(category)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get single media item
    public MediaResponseDTO getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Media not found with id: " + id));
        return new MediaResponseDTO(media);
    }

    // Delete media — removes file from disk AND database
    public void deleteMedia(Long id) throws IOException {
        Media media = mediaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Media not found with id: " + id));

        // Delete physical file
        Path filePath = Paths.get(uploadDir).resolve(media.getStoredFileName());
        Files.deleteIfExists(filePath);

        // Delete database record
        mediaRepository.deleteById(id);
    }

    // Helper: get file extension e.g. ".jpg"
    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }

    // Helper: determine if image or video from MIME type
    private Media.MediaType determineMediaType(String contentType) {
        if (contentType != null) {
            if (contentType.startsWith("image/")) return Media.MediaType.IMAGE;
            if (contentType.startsWith("video/")) return Media.MediaType.VIDEO;
        }
        return Media.MediaType.DOCUMENT;
    }
}