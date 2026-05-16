package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.Media;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class MediaResponseDTO {

    private Long mediaId;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private Media.MediaType mediaType;
    private Media.MediaCategory category;
    private Media.MediaUsage usage;
    private String title;
    private String description;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
    private String youtubeWatchUrl;
    
    // YouTube fields
    private Boolean isYoutubeVideo;
    private String youtubeVideoId;
    private String youtubeThumbnail;
    private String youtubeEmbedUrl;  // Embed URL for iframe

    public MediaResponseDTO(Media media) {
        this.mediaId = media.getMediaId();
        this.fileName = media.getFileName();
        this.fileUrl = media.getFileUrl();
        this.fileType = media.getFileType();
        this.fileSize = media.getFileSize();
        this.mediaType = media.getMediaType();
        this.category = media.getCategory();
        this.usage = media.getUsage();
        this.title = media.getTitle();
        this.description = media.getDescription();
        this.uploadedBy = media.getUploadedBy();
        this.uploadedAt = media.getUploadedAt();
        this.isYoutubeVideo = media.getIsYoutubeVideo();
        this.youtubeVideoId = media.getYoutubeVideoId();
        this.youtubeThumbnail = media.getYoutubeThumbnail();
        //this.youtubeEmbedUrl = null;

        // Generate YouTube embed URL
        if (media.getIsYoutubeVideo() && media.getYoutubeVideoId() != null) {
            this.youtubeEmbedUrl = "https://www.youtube.com/embed/" + 
                media.getYoutubeVideoId();
                this.youtubeWatchUrl = "https://www.youtube.com/watch?v=" + media.getYoutubeVideoId();
        }
    }
}