package be.pxl.services.repository;

import be.pxl.services.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findTopByPostIdOrderByCreationDateDesc(Long postId);
}
