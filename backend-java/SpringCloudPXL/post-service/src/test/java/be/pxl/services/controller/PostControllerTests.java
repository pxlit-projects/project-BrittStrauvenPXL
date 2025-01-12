package be.pxl.services.controller;

import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.client.CommentClient;
import be.pxl.services.client.ReviewClient;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private ReviewClient reviewClient;

    @Mock
    private CommentClient commentClient;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    private Post conceptPost;
    private Post publishedPost;

    @BeforeEach
    void setUp() {
        postRepository.deleteAll();

        conceptPost = Post.builder()
                .title("Concept Post")
                .content("This is a concept post")
                .author("author1")
                .status(PostStatus.CONCEPT)
                .creationDate(LocalDate.now())
                .build();

        publishedPost = Post.builder()
                .title("Published Post")
                .content("This is a published post")
                .author("author2")
                .status(PostStatus.PUBLISHED)
                .creationDate(LocalDate.now())
                .build();

        postRepository.saveAll(List.of(conceptPost, publishedPost));
    }

    @Test
    public void testCreatePost_EditorRole() throws Exception {
        CreatePostRequest request = new CreatePostRequest("New Post", "New Content", "editorUser", true);
        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated());

        Optional<Post> savedPost = postRepository.findAll().stream()
                .filter(post -> post.getTitle().equals("New Post"))
                .findFirst();
        Assertions.assertTrue(savedPost.isPresent());
    }

    @Test
    public void testCreatePost_NonEditorRole() throws Exception {
        CreatePostRequest request = new CreatePostRequest("Unauthorized Post", "Content", "user1", true);
        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testGetAllPosts_NonEditorRole() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post")
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Published Post"))
                .andExpect(jsonPath("$[0].postStatus").value(PostStatus.PUBLISHED.name()));
    }

    @Test
    public void testGetAllPosts_EditorRole() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2)) // ✅ Editor sees all posts
                .andExpect(jsonPath("$[0].title").value("Concept Post"))
                .andExpect(jsonPath("$[1].title").value("Published Post"));
    }

    @Test
    public void testGetPostById() throws Exception {
        when(reviewClient.getReviewByPostId(publishedPost.getId())).thenReturn(new ReviewDto(true, "Great post!"));
        when(commentClient.getAllCommentsByPostId(publishedPost.getId())).thenReturn(new ArrayList<>());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/{id}", publishedPost.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.post.title").value("Published Post"));
    }

    @Test
    public void testEditPost_EditorRole() throws Exception {
        CreatePostRequest updateRequest = new CreatePostRequest("Updated Title", "Updated Content", "author1", false);
        String requestJson = objectMapper.writeValueAsString(updateRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/{id}", conceptPost.getId())
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk());

        Post updatedPost = postRepository.findById(conceptPost.getId()).orElseThrow();
        Assertions.assertEquals("Updated Title", updatedPost.getTitle());
        Assertions.assertEquals("Updated Content", updatedPost.getContent());
    }

    @Test
    public void testEditPost_NonEditorRole() throws Exception {
        CreatePostRequest updateRequest = new CreatePostRequest("Illegal Edit", "Should not be allowed", "user1", false);
        String requestJson = objectMapper.writeValueAsString(updateRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/{id}", conceptPost.getId())
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isForbidden());
    }
}
