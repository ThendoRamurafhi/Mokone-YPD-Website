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
import java.util.*;
import java.util.stream.Collectors;
 
@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ══════════════════════════════════════════════════════════════
    // SECURITY CONSTANTS
    // ══════════════════════════════════════════════════════════════
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"
    );
    private static final List<String> ALLOWED_VIDEO_TYPES = List.of(
        "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"
    );
    private static final List<String> ALLOWED_DOC_TYPES = List.of(
        "application/pdf"
    );
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    // ══════════════════════════════════════════════════════════════
    // UPLOAD FILE (LOCAL STORAGE)
    // ══════════════════════════════════════════════════════════════
    public MediaResponseDTO uploadFile(
            MultipartFile file,
            String title,
            String description,
            String uploadedBy,
            Media.MediaCategory category,
            Media.MediaUsage usage) throws IOException {

        // ── Validation ── 
        validateFile(file);
 
        // ── Generate safe filename ──
        String contentType = file.getContentType();
        String fileExtension = sanitizeExtension(
            getFileExtension(file.getOriginalFilename()), contentType);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
 
        // ── Save to disk ──
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
 
        Path filePath = uploadPath.resolve(storedFileName).normalize();
 
        // Path traversal check
        if (!filePath.startsWith(uploadPath)) {
            throw new RuntimeException("Invalid file path detected");
        }
 
        Files.copy(file.getInputStream(), filePath,
            StandardCopyOption.REPLACE_EXISTING);
 
        // ── Save to database ──
        Media.MediaType mediaType = determineMediaType(contentType);
 
        Media media = new Media();
        media.setFileName(sanitizeFileName(file.getOriginalFilename()));
        media.setStoredFileName(storedFileName);
        //media.setFileUrl("/api/v1/media/files/" + storedFileName);
        media.setFileUrl("http://localhost:8080/api/v1/media/files/" + storedFileName);
        media.setFileType(contentType);
        media.setFileSize(file.getSize());
        media.setMediaType(mediaType);
        media.setCategory(category != null ? category : Media.MediaCategory.GENERAL);
        media.setUsage(usage != null ? usage : Media.MediaUsage.GENERAL);
        media.setTitle(title != null ? title : sanitizeFileName(file.getOriginalFilename()));
        media.setDescription(description);
        media.setUploadedBy(uploadedBy);
        media.setIsYoutubeVideo(false);
 
        Media saved = mediaRepository.save(media);
        return new MediaResponseDTO(saved);
    }
 
    // ══════════════════════════════════════════════════════════════
    // SAVE YOUTUBE VIDEO REFERENCE
    // ══════════════════════════════════════════════════════════════
    public MediaResponseDTO saveYoutubeVideo(
            String youtubeVideoId,
            String title,
            String description,
            String uploadedBy,
            Media.MediaCategory category,
            Media.MediaUsage usage) {
 
        // Validate YouTube video ID format (11 characters, alphanumeric + - _)
        if (youtubeVideoId == null || !youtubeVideoId.matches("[A-Za-z0-9_-]{11}")) {
            throw new RuntimeException("Invalid YouTube video ID format");
        }
 
        Media media = new Media();
        media.setYoutubeVideoId(youtubeVideoId);
        media.setYoutubeThumbnail(
            "https://img.youtube.com/vi/" + youtubeVideoId + "/maxresdefault.jpg");
        media.setIsYoutubeVideo(true);
        media.setFileUrl("https://www.youtube.com/watch?v=" + youtubeVideoId);
        media.setMediaType(Media.MediaType.VIDEO);
        media.setCategory(category != null ? category : Media.MediaCategory.GENERAL);
        media.setUsage(usage != null ? usage : Media.MediaUsage.GALLERY);
        media.setTitle(title != null ? title : "YouTube Video");
        media.setDescription(description);
        media.setUploadedBy(uploadedBy);
        media.setFileName("youtube-" + youtubeVideoId);
 
        Media saved = mediaRepository.save(media);
        return new MediaResponseDTO(saved);
    }
 
    // ══════════════════════════════════════════════════════════════
    // QUERY METHODS
    // ══════════════════════════════════════════════════════════════
    
    public List<MediaResponseDTO> getAllMedia() {
        return mediaRepository.findAll()
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }
 
    public List<MediaResponseDTO> getByType(Media.MediaType mediaType) {
        return mediaRepository
            .findByMediaTypeOrderByUploadedAtDesc(mediaType)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }
 
    public List<MediaResponseDTO> getByCategory(Media.MediaCategory category) {
        return mediaRepository
            .findByCategoryOrderByUploadedAtDesc(category)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }
 
    public List<MediaResponseDTO> getByUsage(Media.MediaUsage usage) {
        return mediaRepository
            .findByUsageOrderByUploadedAtDesc(usage)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }
 
    public List<MediaResponseDTO> getByCategoryAndUsage(
            Media.MediaCategory category, 
            Media.MediaUsage usage) {
        return mediaRepository
            .findByCategoryAndUsageOrderByUploadedAtDesc(category, usage)
            .stream()
            .map(MediaResponseDTO::new)
            .collect(Collectors.toList());
    }
 
    public MediaResponseDTO getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Media not found with id: " + id));
        return new MediaResponseDTO(media);
    }
 
    // ══════════════════════════════════════════════════════════════
    // DELETE MEDIA
    // ══════════════════════════════════════════════════════════════
    
    public void deleteMedia(Long id) throws IOException {
        Media media = mediaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Media not found with id: " + id));
 
        // Only delete physical file if not YouTube video
        if (!media.getIsYoutubeVideo() && media.getStoredFileName() != null) {
            Path filePath = Paths.get(uploadDir)
                .resolve(media.getStoredFileName())
                .normalize();
            Files.deleteIfExists(filePath);
        }
 
        mediaRepository.deleteById(id);
    }
 
    // ══════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ══════════════════════════════════════════════════════════════
 
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }
 
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 50MB limit");
        }
 
        String contentType = file.getContentType();
        List<String> allAllowed = new ArrayList<>();
        allAllowed.addAll(ALLOWED_IMAGE_TYPES);
        allAllowed.addAll(ALLOWED_VIDEO_TYPES);
        allAllowed.addAll(ALLOWED_DOC_TYPES);
 
        if (contentType == null || !allAllowed.contains(contentType)) {
            throw new RuntimeException(
                "File type not allowed. Only images, videos and PDFs accepted.");
        }
    }
 
    private String sanitizeExtension(String extension, String contentType) {
        Map<String, String> safeExtensions = Map.of(
            "image/jpeg", ".jpg",
            "image/jpg", ".jpg",
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
 
    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unnamed";
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
 
    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }
 
    private Media.MediaType determineMediaType(String contentType) {
        if (contentType != null) {
            if (contentType.startsWith("image/")) return Media.MediaType.IMAGE;
            if (contentType.startsWith("video/")) return Media.MediaType.VIDEO;
        }
        return Media.MediaType.DOCUMENT;
    }
}