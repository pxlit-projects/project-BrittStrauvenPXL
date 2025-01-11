package be.pxl.services.api.controller;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.request.CommentRequest;
import be.pxl.services.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/comment")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public void createComment(@RequestBody CommentRequest request, @RequestHeader("user") String user) {
        commentService.createNewComment(request, user);
    }

    @GetMapping("/{postId}")
    public List<CommentDto> getAllCommentsByPostId(@PathVariable Long postId) {
        return commentService.getAllCommentsByPostId(postId);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id, @RequestHeader("user") String user) {
        commentService.deleteComment(id, user);
    }

    @PutMapping("/{id}")
    public void putComment(@PathVariable Long id, @RequestHeader("user") String user, @RequestBody CommentRequest request) {
        commentService.putComment(id, request, user);
    }
}
