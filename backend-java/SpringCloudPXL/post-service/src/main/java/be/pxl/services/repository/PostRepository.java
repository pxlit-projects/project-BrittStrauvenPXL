package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import be.pxl.services.domain.PostStatus;
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE " +
            "(:author IS NULL OR LOWER(p.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
            "(:content IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :content, '%'))) AND " +
            "(:date IS NULL OR p.creationDate = :date)")
    List<Post> findFilteredPosts(@Param("author") String author,
                                 @Param("content") String content,
                                 @Param("date") LocalDate date);

    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' AND " +
            "(:author IS NULL OR LOWER(p.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
            "(:content IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :content, '%'))) AND " +
            "(:date IS NULL OR p.creationDate = :date)")
    List<Post> findFilteredPublishedPosts(@Param("author") String author,
                                          @Param("content") String content,
                                          @Param("date") LocalDate date);
}
