package be.pxl.services.service;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
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

    @BeforeEach
    void setUp() {
        commentRepository.deleteAll(); // Ensures a fresh database before each test
    }

    @Test
    public void testCreateNewComment_Success() {
        CommentRequest request = new CommentRequest(1L, "This is a test comment");
        commentService.createNewComment(request, USERNAME);

        List<Comment> savedComments = commentRepository.findByPostId(1L);
        assertFalse(savedComments.isEmpty());
        assertEquals("This is a test comment", savedComments.get(0).getContent());
    }

    @Test
    public void testGetAllCommentsByPostId_Success() {
        CommentRequest request = new CommentRequest(1L, "First comment");
        commentService.createNewComment(request, USERNAME);

        List<CommentDto> comments = commentService.getAllCommentsByPostId(1L);
        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("First comment", comments.get(0).content());
    }

    @Test
    public void testUpdateComment_Success() {
        CommentRequest request = new CommentRequest(1L, "Original Comment");
        commentService.createNewComment(request, USERNAME);

        Long commentId = commentRepository.findByPostId(1L).get(0).getId();

        CommentRequest updatedRequest = new CommentRequest(1L, "Updated comment content");
        commentService.putComment(commentId, updatedRequest, USERNAME);

        Comment updatedComment = commentRepository.findById(commentId).orElseThrow();
        assertEquals("Updated comment content", updatedComment.getContent());
    }

    @Test
    public void testUpdateComment_FailsForUnauthorizedUser() {
        CommentRequest request = new CommentRequest(1L, "Original Comment");
        commentService.createNewComment(request, USERNAME);

        Long commentId = commentRepository.findByPostId(1L).get(0).getId();

        CommentRequest updatedRequest = new CommentRequest(1L, "Another update");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.putComment(commentId, updatedRequest, OTHER_USER);
        });

        assertEquals("This comment is not yours", exception.getMessage());
    }

    @Test
    public void testDeleteComment_Success() {
        CommentRequest request = new CommentRequest(1L, "Comment to delete");
        commentService.createNewComment(request, USERNAME);

        Long commentId = commentRepository.findByPostId(1L).get(0).getId();

        commentService.deleteComment(commentId, USERNAME);

        assertTrue(commentRepository.findById(commentId).isEmpty());
    }

    @Test
    public void testDeleteComment_FailsForUnauthorizedUser() {
        CommentRequest request = new CommentRequest(1L, "This will be deleted");
        commentService.createNewComment(request, USERNAME);

        Long commentId = commentRepository.findByPostId(1L).get(0).getId();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.deleteComment(commentId, OTHER_USER);
        });

        assertEquals("This comment is not yours", exception.getMessage());
    }
}
