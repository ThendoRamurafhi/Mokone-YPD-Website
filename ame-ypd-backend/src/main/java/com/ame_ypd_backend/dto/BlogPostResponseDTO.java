package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.BlogPost;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogPostResponseDTO {

    private Long postId;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String authorName;
    private String featuredImageUrl;
    private String tags;
    private Integer viewCount;
    private BlogPost.PostStatus status;
    private BlogPost.PostCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;

    public BlogPostResponseDTO(BlogPost post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        this.slug = post.getSlug();
        this.content = post.getContent();
        this.excerpt = post.getExcerpt();
        this.authorName = post.getAuthorName();
        this.featuredImageUrl = post.getFeaturedImageUrl();
        this.tags = post.getTags();
        this.viewCount = post.getViewCount();
        this.status = post.getStatus();
        this.category = post.getCategory();
        this.createdAt = post.getCreatedAt();
        this.publishedAt = post.getPublishedAt();
        this.updatedAt = post.getUpdatedAt();
    }
}