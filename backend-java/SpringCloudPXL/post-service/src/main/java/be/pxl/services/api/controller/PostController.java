package be.pxl.services.api.controller;

import be.pxl.services.api.dto.PostDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.services.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public void createPost(@RequestBody CreatePostRequest request) {
        postService.createNewPost(request);
    }

    @GetMapping
    public List<PostDto> getAllPosts() {
        return postService.getAllPosts();
    }

    @PutMapping("/{id}")
    public void editPost(@RequestBody CreatePostRequest request, @PathVariable Long id) {
        postService.editPost(id, request);
    }

    @GetMapping("/{id}")
    public PostDto getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }
}
