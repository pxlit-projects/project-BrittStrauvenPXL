package be.pxl.services.service;

import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreateNewReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import org.junit.jupiter.api.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
@Testcontainers
public class ReviewServiceTests {

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");
    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @BeforeEach
    void setUp() {
        reviewRepository.deleteAll();
    }

    @Test
    public void testCreateNewReviewRequest_Success() {
        CreateNewReviewRequest request = new CreateNewReviewRequest(1L, true, "Well written!");

        reviewService.CreateNewReviewRequest(request);

        Optional<Review> savedReview = reviewRepository.findTopByPostIdOrderByCreationDateDesc(1L);
        assertThat(savedReview).isPresent();
        assertThat(savedReview.get().getReviewMessage()).isEqualTo("Well written!");
        assertThat(savedReview.get().isApproved()).isTrue();
        assertThat(savedReview.get().getPostId()).isEqualTo(1L);
        assertThat(savedReview.get().getCreationDate()).isNotNull();

        verify(rabbitTemplate, times(1)).convertAndSend(eq("reviewQueue"), any(Review.class));
    }

    @Test
    public void testGetLatestReviewByPostId_Success() {
        Review review = new Review();
        review.setPostId(2L);
        review.setApproved(false);
        review.setReviewMessage("Needs more references");
        review.setCreationDate(LocalDateTime.now());

        reviewRepository.save(review);

        ReviewDto latestReview = reviewService.getLatestReviewByPostId(2L);

        assertThat(latestReview).isNotNull();
        assertThat(latestReview.reviewMessage()).isEqualTo("Needs more references");
        assertThat(latestReview.approved()).isFalse();
    }

    @Test
    public void testGetLatestReviewByPostId_NotFound() {
        ReviewDto latestReview = reviewService.getLatestReviewByPostId(99L);
        assertThat(latestReview).isNull();
    }
}
