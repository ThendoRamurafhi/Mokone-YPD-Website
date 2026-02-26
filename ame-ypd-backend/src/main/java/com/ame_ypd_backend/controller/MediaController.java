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

@RestController
@RequestMapping("/media")
@CrossOrigin(origins = "*")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // POST /api/v1/media/upload — multipart form data
    @PostMapping("/upload")
    public ResponseEntity<MediaResponseDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "category", required = false)
                Media.MediaCategory category) {
        try {
            MediaResponseDTO response = mediaService.uploadFile(
                file, title, description, uploadedBy, category);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/v1/media — all media
    @GetMapping
    public ResponseEntity<List<MediaResponseDTO>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    // GET /api/v1/media/type/IMAGE
    @GetMapping("/type/{mediaType}")
    public ResponseEntity<List<MediaResponseDTO>> getByType(
            @PathVariable Media.MediaType mediaType) {
        return ResponseEntity.ok(mediaService.getByType(mediaType));
    }

    // GET /api/v1/media/category/EVENTS
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MediaResponseDTO>> getByCategory(
            @PathVariable Media.MediaCategory category) {
        return ResponseEntity.ok(mediaService.getByCategory(category));
    }

    // GET /api/v1/media/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MediaResponseDTO> getMediaById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    // GET /api/v1/media/files/{fileName} — serve the actual file
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
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

    // DELETE /api/v1/media/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        try {
            mediaService.deleteMedia(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}