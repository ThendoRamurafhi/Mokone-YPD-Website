package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    // ══════════════════════════════════════════════════════════════
    // QUERY BY MEDIA TYPE
    // ══════════════════════════════════════════════════════════════
    
    List<Media> findByMediaTypeOrderByUploadedAtDesc(Media.MediaType mediaType);

    // ══════════════════════════════════════════════════════════════
    // QUERY BY CATEGORY
    // ══════════════════════════════════════════════════════════════
    
    List<Media> findByCategoryOrderByUploadedAtDesc(Media.MediaCategory category);

    List<Media> findByMediaTypeAndCategoryOrderByUploadedAtDesc(
        Media.MediaType mediaType, 
        Media.MediaCategory category);

    // ══════════════════════════════════════════════════════════════
    // QUERY BY USAGE
    // ══════════════════════════════════════════════════════════════
    
    List<Media> findByUsageOrderByUploadedAtDesc(Media.MediaUsage usage);

    List<Media> findByCategoryAndUsageOrderByUploadedAtDesc(
        Media.MediaCategory category,
        Media.MediaUsage usage);

    List<Media> findByMediaTypeAndUsageOrderByUploadedAtDesc(
        Media.MediaType mediaType,
        Media.MediaUsage usage);

    // ══════════════════════════════════════════════════════════════
    // QUERY YOUTUBE VIDEOS
    // ══════════════════════════════════════════════════════════════
    
    List<Media> findByIsYoutubeVideoTrueOrderByUploadedAtDesc();

    List<Media> findByIsYoutubeVideoFalseOrderByUploadedAtDesc();
}