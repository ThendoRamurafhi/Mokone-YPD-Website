package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByMediaTypeOrderByUploadedAtDesc(Media.MediaType mediaType);

    List<Media> findByCategoryOrderByUploadedAtDesc(Media.MediaCategory category);

    List<Media> findByMediaTypeAndCategoryOrderByUploadedAtDesc(
        Media.MediaType mediaType, Media.MediaCategory category);
}