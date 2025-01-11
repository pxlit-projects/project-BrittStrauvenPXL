package be.pxl.services.service;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.dto.PostDetailDto;
import be.pxl.services.api.dto.PostDto;
import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.client.CommentClient;
import be.pxl.services.client.ReviewClient;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.MailService;
import be.pxl.services.services.PostService;
import be.pxl.services.services.converter.PostConverter;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PostServiceTests {

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private PostConverter postConverter;

    @MockBean
    private CommentClient commentClient;

    @MockBean
    private ReviewClient reviewClient;

    @MockBean
    private MailService mailService;

    @Autowired
    private PostService postService;

    private static final LocalDate FIXED_DATE = LocalDate.of(2025, 1, 10);

    private static Post testPost;

    @BeforeEach
    void setUp() {
        testPost = new Post();
        testPost.setId(1L);
        testPost.setTitle("Test Post");
        testPost.setContent("Test Content");
        testPost.setAuthor("Author");
        testPost.setCreationDate(FIXED_DATE);
        testPost.setStatus(PostStatus.CONCEPT);
    }

    @Test
    @Order(1)
    public void testCreateNewPost() {
        CreatePostRequest request = new CreatePostRequest("New Post", "New Content", "New Author", true);
        postService.createNewPost(request);

        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());

        Post savedPost = postCaptor.getValue();
        assertEquals("New Post", savedPost.getTitle());
        assertEquals(PostStatus.CONCEPT, savedPost.getStatus());
    }

    @Test
    @Order(2)
    public void testEditPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        CreatePostRequest updateRequest = new CreatePostRequest("Updated Title", "Updated Content", "Updated Author", false);
        postService.editPost(1L, updateRequest);

        verify(postRepository, times(1)).save(any(Post.class));

        assertEquals("Updated Title", testPost.getTitle());
        assertEquals(PostStatus.PUBLISHED, testPost.getStatus()); // Status changed to PUBLISHED
    }

    @Test
    @Order(3)
    public void testGetPostById() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postConverter.convert(testPost)).thenReturn(new PostDto(1L, "Test Post", "Test Content", "Author", PostStatus.CONCEPT, "2025-01-10"));
        when(commentClient.getAllCommentsByPostId(1L)).thenReturn(Collections.emptyList());
        when(reviewClient.getReviewByPostId(1L)).thenReturn(new ReviewDto(true, "Approved"));

        PostDetailDto postDetail = postService.getPostById(1L);

        assertEquals("Test Post", postDetail.post().title());
        assertEquals("Approved", postDetail.review().reviewMessage());
        assertTrue(postDetail.comments().isEmpty());
    }

    @Test
    @Order(4)
    public void testGetFilteredPosts() {
        when(postRepository.findFilteredPosts(null, null, null)).thenReturn(List.of(testPost));
        when(postConverter.convert(testPost)).thenReturn(new PostDto(1L, "Test Post", "Test Content", "Author", PostStatus.CONCEPT, "2025-01-10"));

        List<PostDto> filteredPosts = postService.getFilteredPosts(null, null, null);

        assertEquals(1, filteredPosts.size());
        assertEquals("Test Post", filteredPosts.get(0).title());
    }

    @Test
    @Order(5)
    public void testReceiveReview_Approved() {
        Review review = new Review();
        review.setPostId(1L);
        review.setApproved(true);
        review.setReviewMessage("Great post!");

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        postService.receiveReview(review);

        assertEquals(PostStatus.APPROVED, testPost.getStatus());
        verify(postRepository, times(1)).save(testPost);
        verify(mailService, times(1)).sendEmail(anyString(), anyString(), contains("approved"));
    }

    @Test
    @Order(6)
    public void testReceiveReview_Rejected() {
        Review review = new Review();
        review.setPostId(1L);
        review.setApproved(false);
        review.setReviewMessage("Needs improvement.");

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        postService.receiveReview(review);

        assertEquals(PostStatus.REJECTED, testPost.getStatus());
        verify(postRepository, times(1)).save(testPost);
        verify(mailService, times(1)).sendEmail(anyString(), anyString(), contains("rejected"));
    }
}
