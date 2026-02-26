package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Media;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MediaResponseDTO {

    private Long mediaId;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private Media.MediaType mediaType;
    private Media.MediaCategory category;
    private String title;
    private String description;
    private String uploadedBy;
    private LocalDateTime uploadedAt;

    public MediaResponseDTO(Media media) {
        this.mediaId = media.getMediaId();
        this.fileName = media.getFileName();
        this.fileUrl = media.getFileUrl();
        this.fileType = media.getFileType();
        this.fileSize = media.getFileSize();
        this.mediaType = media.getMediaType();
        this.category = media.getCategory();
        this.title = media.getTitle();
        this.description = media.getDescription();
        this.uploadedBy = media.getUploadedBy();
        this.uploadedAt = media.getUploadedAt();
    }
}