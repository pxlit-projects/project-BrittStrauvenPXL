package be.pxl.services.service;

import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreateNewReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    public ReviewService(ReviewRepository reviewRepository, RabbitTemplate rabbitTemplate) {
        this.reviewRepository = reviewRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public void CreateNewReviewRequest(CreateNewReviewRequest createNewReviewRequest) {
        Review review = new Review();
        review.setPostId(createNewReviewRequest.postId());
        review.setApproved(createNewReviewRequest.approved());
        review.setReviewMessage(createNewReviewRequest.reviewMessage());
        review.setCreationDate(LocalDateTime.now());

        reviewRepository.save(review);
        logger.info("Review with id {} created", review.getId());

        rabbitTemplate.convertAndSend("reviewQueue", review);

    }

    public ReviewDto getLatestReviewByPostId(Long postId) {
        return reviewRepository.findTopByPostIdOrderByCreationDateDesc(postId)
                .map(review -> new ReviewDto(review.isApproved(), review.getReviewMessage()))
                .orElse(null);
    }
}
