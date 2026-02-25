package com.ame_ypd_backend.dto;

import com.ame_ypd_backend.entity.BlogPost;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogPostRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be under 255 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String excerpt;
    private String authorName;
    private String featuredImageUrl;
    private String tags;
    private BlogPost.PostCategory category = BlogPost.PostCategory.GENERAL;
    private BlogPost.PostStatus status = BlogPost.PostStatus.DRAFT;
}