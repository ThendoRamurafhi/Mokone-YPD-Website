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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Upload a file
    public MediaResponseDTO uploadFile(
            MultipartFile file,
            String title,
            String description,
            String uploadedBy,
            Media.MediaCategory category) throws IOException {

        // Step 1: Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Step 2: Generate unique filename to avoid conflicts
        // UUID ensures no two files ever have the same name — O(1) uniqueness
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        // Step 3: Save file to disk
        Path filePath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath,
            StandardCopyOption.REPLACE_EXISTING);

        // Step 4: Determine media type from file content type
        Media.MediaType mediaType = determineMediaType(file.getContentType());

        // Step 5: Save metadata to database
        Media media = new Media();
        media.setFileName(originalFileName);
        media.setStoredFileName(storedFileName);
        media.setFileUrl("/api/v1/media/files/" + storedFileName);
        media.setFileType(file.getContentType());
        media.setFileSize(file.getSize());
        media.setMediaType(mediaType);
        media.setCategory(category != null ? category : Media.MediaCategory.GENERAL);
        media.setTitle(title != null ? title : originalFileName);
        media.setDescription(description);
        media.setUploadedBy(uploadedBy);

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