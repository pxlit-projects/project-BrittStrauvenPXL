package be.pxl.services.service;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.service.converter.CommentConverter;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CommentServiceTests {

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

    private static final String USERNAME = "testUser";
    private static final String OTHER_USER = "otherUser";
    private static Long commentId;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public CommentService commentService(CommentRepository commentRepository, CommentConverter commentConverter) {
            return new CommentService(commentRepository, commentConverter);
        }
    }

    @Test
    @Order(1)
    public void testCreateNewComment_Success() {
        CommentRequest request = new CommentRequest(1L, "This is a test comment");

        commentService.createNewComment(request, USERNAME);

        List<Comment> savedComments = commentRepository.findByPostId(1L);
        assertFalse(savedComments.isEmpty());
        assertEquals("This is a test comment", savedComments.get(0).getContent());

        commentId = savedComments.get(0).getId();
    }

    @Test
    @Order(2)
    public void testGetAllCommentsByPostId_Success() {
        List<CommentDto> comments = commentService.getAllCommentsByPostId(1L);
        assertNotNull(comments);
        assertEquals(1, comments.size());
    }

    @Test
    @Order(3)
    public void testUpdateComment_Success() {
        CommentRequest updatedRequest = new CommentRequest(1L, "Updated comment content");

        commentService.putComment(commentId, updatedRequest, USERNAME);

        Comment updatedComment = commentRepository.findById(commentId).orElseThrow();
        assertEquals("Updated comment content", updatedComment.getContent());
    }

    @Test
    @Order(4)
    public void testUpdateComment_FailsForUnauthorizedUser() {
        CommentRequest updatedRequest = new CommentRequest(1L, "Another update");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.putComment(commentId, updatedRequest, OTHER_USER);
        });

        assertEquals("This comment is not yours", exception.getMessage());
    }

    @Test
    @Order(5)
    public void testDeleteComment_Success() {
        commentService.deleteComment(commentId, USERNAME);

        assertTrue(commentRepository.findById(commentId).isEmpty());
    }

    @Test
    @Order(6)
    public void testDeleteComment_FailsForUnauthorizedUser() {
        CommentRequest request = new CommentRequest(1L, "This will be deleted");
        commentService.createNewComment(request, USERNAME);

        Long newCommentId = commentRepository.findByPostId(1L).get(0).getId();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.deleteComment(newCommentId, OTHER_USER);
        });

        assertEquals("This comment is not yours", exception.getMessage());
    }
}
