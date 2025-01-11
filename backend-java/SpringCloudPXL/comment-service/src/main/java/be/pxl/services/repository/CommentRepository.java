package be.pxl.services.repository;

import be.pxl.services.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByIdAndCommenter(Long id, String commenter);
    List<Comment> findByPostId(Long postId);
}
