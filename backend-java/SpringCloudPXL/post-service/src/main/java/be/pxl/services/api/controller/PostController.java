package be.pxl.services.api.controller;

import be.pxl.services.api.dto.PostDetailDto;
import be.pxl.services.api.dto.PostDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Void> createPost(@RequestHeader("role") String role, @RequestBody CreatePostRequest request) {
        if (!role.equals("editor")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to create a post");
        }

        postService.createNewPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public List<PostDto> getAllPosts(
            @RequestHeader("role") String role,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String date) {

        if (!role.equals("editor")) {
            return postService.getFilteredPublishedPosts(author, content, date);
        } else {
            return postService.getFilteredPosts(author, content, date);
        }
    }

    @PutMapping("/{id}")
    public void editPost(@RequestHeader("role") String role, @RequestBody CreatePostRequest request, @PathVariable Long id) {
        if (!role.equals("editor")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to create a post");
        }
        postService.editPost(id, request);
    }

    @GetMapping("/{id}")
    public PostDetailDto getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }
}
