package be.pxl.services.client;

import be.pxl.services.api.dto.ReviewDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {
    @GetMapping("/api/review/{postId}")
    ReviewDto getReviewByPostId(@PathVariable Long postId);
}
