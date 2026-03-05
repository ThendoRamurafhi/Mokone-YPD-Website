package com.ame_ypd_backend.controller;

import com.ame_ypd_backend.dto.BlogPostRequestDTO;
import com.ame_ypd_backend.dto.BlogPostResponseDTO;
import com.ame_ypd_backend.entity.BlogPost;
import com.ame_ypd_backend.service.BlogPostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/blog")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogPostService blogPostService;

    // POST /api/v1/blog
    @PostMapping
    public ResponseEntity<BlogPostResponseDTO> createPost(
            @Valid @RequestBody BlogPostRequestDTO dto) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(blogPostService.createPost(dto));
    }

    // GET /api/v1/blog
    @GetMapping
    public ResponseEntity<List<BlogPostResponseDTO>> getPublishedPosts() {
        return ResponseEntity.ok(blogPostService.getPublishedPosts());
    }

    // GET /api/v1/blog/my-first-post
    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostResponseDTO> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogPostService.getPostBySlug(slug));
    }

    // GET /api/v1/blog/category/DEVOTIONAL
    @GetMapping("/category/{category}")
    public ResponseEntity<List<BlogPostResponseDTO>> getByCategory(
            @PathVariable BlogPost.PostCategory category) {
        return ResponseEntity.ok(blogPostService.getPostsByCategory(category));
    }

    // PUT /api/v1/blog/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BlogPostResponseDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody BlogPostRequestDTO dto) {
        return ResponseEntity.ok(blogPostService.updatePost(id, dto));
    }

    // DELETE /api/v1/blog/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}