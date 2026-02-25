package com.ame_ypd_backend.service;

import com.ame_ypd_backend.dto.BlogPostRequestDTO;
import com.ame_ypd_backend.dto.BlogPostResponseDTO;
import com.ame_ypd_backend.entity.BlogPost;
import com.ame_ypd_backend.exception.ResourceNotFoundException;
import com.ame_ypd_backend.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    // Create new post
    public BlogPostResponseDTO createPost(BlogPostRequestDTO dto) {
        BlogPost post = new BlogPost();
        post.setTitle(dto.getTitle());
        post.setSlug(generateSlug(dto.getTitle())); // Auto-generate slug from title
        post.setContent(dto.getContent());
        post.setExcerpt(dto.getExcerpt());
        post.setAuthorName(dto.getAuthorName());
        post.setFeaturedImageUrl(dto.getFeaturedImageUrl());
        post.setTags(dto.getTags());
        post.setCategory(dto.getCategory());
        post.setStatus(dto.getStatus());

        // If publishing immediately, set publishedAt
        if (dto.getStatus() == BlogPost.PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }

        return new BlogPostResponseDTO(blogPostRepository.save(post));
    }

    // Get all published posts
    public List<BlogPostResponseDTO> getPublishedPosts() {
        return blogPostRepository
            .findByStatusOrderByPublishedAtDesc(BlogPost.PostStatus.PUBLISHED)
            .stream()
            .map(BlogPostResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Get single post by slug — also increments view count
    public BlogPostResponseDTO getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Blog post not found with slug: " + slug));

        // Increment view count every time post is opened
        post.setViewCount(post.getViewCount() + 1);
        return new BlogPostResponseDTO(blogPostRepository.save(post));
    }

    // Get posts by category
    public List<BlogPostResponseDTO> getPostsByCategory(BlogPost.PostCategory category) {
        return blogPostRepository
            .findByStatusAndCategoryOrderByPublishedAtDesc(
                BlogPost.PostStatus.PUBLISHED, category)
            .stream()
            .map(BlogPostResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Update post
    public BlogPostResponseDTO updatePost(Long id, BlogPostRequestDTO dto) {
        BlogPost post = blogPostRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Blog post not found with id: " + id));

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setExcerpt(dto.getExcerpt());
        post.setAuthorName(dto.getAuthorName());
        post.setFeaturedImageUrl(dto.getFeaturedImageUrl());
        post.setTags(dto.getTags());
        post.setCategory(dto.getCategory());

        // If being published for the first time, set publishedAt
        if (dto.getStatus() == BlogPost.PostStatus.PUBLISHED
                && post.getStatus() != BlogPost.PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }
        post.setStatus(dto.getStatus());

        return new BlogPostResponseDTO(blogPostRepository.save(post));
    }

    // Delete post
    public void deletePost(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog post not found with id: " + id);
        }
        blogPostRepository.deleteById(id);
    }

    // Slug generator — converts "My First Post!" to "my-first-post"
    // This is an O(n) string algorithm — processes each character once
    private String generateSlug(String title) {
        String baseSlug = title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")  // Remove special characters
            .replaceAll("\\s+", "-")            // Replace spaces with hyphens
            .replaceAll("-+", "-")              // Remove duplicate hyphens
            .trim();

        // If slug already exists, append a number to make it unique
        String slug = baseSlug;
        int counter = 1;
        while (blogPostRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        return slug;
    }
}