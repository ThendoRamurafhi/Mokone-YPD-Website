package com.ame_ypd_backend.repository;

import com.ame_ypd_backend.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    // Find by slug for individual post pages e.g. /blog/my-first-post
    Optional<BlogPost> findBySlug(String slug);

    // All published posts newest first
    List<BlogPost> findByStatusOrderByPublishedAtDesc(BlogPost.PostStatus status);

    // Published posts by category
    List<BlogPost> findByStatusAndCategoryOrderByPublishedAtDesc(
        BlogPost.PostStatus status, BlogPost.PostCategory category);

    // Check slug is unique before saving
    boolean existsBySlug(String slug);
}