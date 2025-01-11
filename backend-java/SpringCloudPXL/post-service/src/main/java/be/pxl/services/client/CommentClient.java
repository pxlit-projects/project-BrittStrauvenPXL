package be.pxl.services.client;

import be.pxl.services.api.dto.CommentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {
    @GetMapping("/api/comment/{postId}")
    List<CommentDto> getAllCommentsByPostId(@PathVariable Long postId);
}
