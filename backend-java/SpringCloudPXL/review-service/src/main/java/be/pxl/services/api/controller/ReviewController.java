package be.pxl.services.api.controller;

import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreateNewReviewRequest;
import be.pxl.services.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public void createReview(@RequestBody CreateNewReviewRequest createNewReviewRequest, @RequestHeader("role") String role) {
        if (!role.equals("editor")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to create a review");
        }
        reviewService.CreateNewReviewRequest(createNewReviewRequest);
    }

    @GetMapping({"/{postId}"})
    public ReviewDto getLatestReviewByPostId(@PathVariable Long postId) {
        return reviewService.getLatestReviewByPostId(postId);
    }
}
