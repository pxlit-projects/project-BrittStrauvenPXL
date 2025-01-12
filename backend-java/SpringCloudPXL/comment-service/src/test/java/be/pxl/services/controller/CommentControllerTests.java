package be.pxl.services.controller;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.request.CommentRequest;
import be.pxl.services.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentControllerTests {

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommentService commentService;

    private static final String USERNAME = "testUser";

    @Test
    public void testCreateComment_Success() throws Exception {
        CommentRequest request = new CommentRequest(1L, "This is a test comment");

        mockMvc.perform(post("/api/comment")
                        .header("user", USERNAME)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(commentService, times(1)).createNewComment(request, USERNAME);
    }

    @Test
    public void testGetAllCommentsByPostId_Success() throws Exception {
        List<CommentDto> mockComments = Arrays.asList(
                new CommentDto(1L, 1L, "First Comment","testUser", LocalDate.now()),
                new CommentDto(2L, 1L, "Second Comment","otherUser", LocalDate.now())
        );

        when(commentService.getAllCommentsByPostId(1L)).thenReturn(mockComments);

        mockMvc.perform(get("/api/comment/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(mockComments.size()))
                .andExpect(jsonPath("$[0].content").value("First Comment"))
                .andExpect(jsonPath("$[1].content").value("Second Comment"));

        verify(commentService, times(1)).getAllCommentsByPostId(1L);
    }

    @Test
    public void testUpdateComment_Success() throws Exception {
        CommentRequest updatedRequest = new CommentRequest(1L, "Updated comment content");

        mockMvc.perform(put("/api/comment/1")
                        .header("user", USERNAME)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(status().isOk());

        verify(commentService, times(1)).putComment(1L, updatedRequest, USERNAME);
    }

    @Test
    public void testDeleteComment_Success() throws Exception {
        mockMvc.perform(delete("/api/comment/1")
                        .header("user", USERNAME))
                .andExpect(status().isOk());

        verify(commentService, times(1)).deleteComment(1L, USERNAME);
    }
}
