package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.MediaResponseDTO;
import com.ame_ypd_backend.entity.Media;
import com.ame_ypd_backend.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/media")
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:5173"}, 
    allowCredentials = "true",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ══════════════════════════════════════════════════════════════
    // UPLOAD FILE (LOCAL STORAGE)
    // ══════════════════════════════════════════════════════════════
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "category", required = false) 
                Media.MediaCategory category,
            @RequestParam(value = "usage", required = false) 
                Media.MediaUsage usage) {
        try {
            MediaResponseDTO response = mediaService.uploadFile(
                file, title, description, uploadedBy, category, usage);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload file"));
        }
    }

    // ══════════════════════════════════════════════════════════════
    // SAVE YOUTUBE VIDEO
    // ══════════════════════════════════════════════════════════════
    
    @PostMapping("/youtube")
    public ResponseEntity<?> saveYoutubeVideo(
            @RequestParam("youtubeVideoId") String youtubeVideoId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "category", required = false) 
                Media.MediaCategory category,
            @RequestParam(value = "usage", required = false) 
                Media.MediaUsage usage) {
        try {
            MediaResponseDTO response = mediaService.saveYoutubeVideo(
                youtubeVideoId, title, description, uploadedBy, category, usage);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // ══════════════════════════════════════════════════════════════
    // QUERY ENDPOINTS
    // ══════════════════════════════════════════════════════════════
    
    @GetMapping
    public ResponseEntity<List<MediaResponseDTO>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    @GetMapping("/type/{mediaType}")
    public ResponseEntity<List<MediaResponseDTO>> getByType(
            @PathVariable Media.MediaType mediaType) {
        return ResponseEntity.ok(mediaService.getByType(mediaType));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MediaResponseDTO>> getByCategory(
            @PathVariable Media.MediaCategory category) {
        return ResponseEntity.ok(mediaService.getByCategory(category));
    }

    @GetMapping("/usage/{usage}")
    public ResponseEntity<List<MediaResponseDTO>> getByUsage(
            @PathVariable Media.MediaUsage usage) {
        return ResponseEntity.ok(mediaService.getByUsage(usage));
    }

    @GetMapping("/category/{category}/usage/{usage}")
    public ResponseEntity<List<MediaResponseDTO>> getByCategoryAndUsage(
            @PathVariable Media.MediaCategory category,
            @PathVariable Media.MediaUsage usage) {
        return ResponseEntity.ok(
            mediaService.getByCategoryAndUsage(category, usage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponseDTO> getMediaById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    // ══════════════════════════════════════════════════════════════
    // SERVE FILE
    // ══════════════════════════════════════════════════════════════
    
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            // Security check
            if (fileName.contains("..") || fileName.contains("/") 
                    || fileName.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(fileName).normalize();

            // Ensure path is inside upload directory
            if (!filePath.startsWith(uploadPath)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "application/octet-stream";
                String fileExtension = fileName.substring(
                    fileName.lastIndexOf(".") + 1).toLowerCase();
                
                switch (fileExtension) {
                    case "jpg":
                    case "jpeg":
                        contentType = "image/jpeg";
                        break;
                    case "png":
                        contentType = "image/png";
                        break;
                    case "gif":
                        contentType = "image/gif";
                        break;
                    case "webp":
                        contentType = "image/webp";
                        break;
                    case "mp4":
                        contentType = "video/mp4";
                        break;
                    case "pdf":
                        contentType = "application/pdf";
                        break;
                }

                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ══════════════════════════════════════════════════════════════
    // DELETE MEDIA
    // ══════════════════════════════════════════════════════════════
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedia(@PathVariable Long id) {
        try {
            mediaService.deleteMedia(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete media"));
        }
    }
}