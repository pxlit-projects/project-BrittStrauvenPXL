package be.pxl.services.controller;

import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreateNewReviewRequest;
import be.pxl.services.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.mockito.ArgumentCaptor;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ReviewControllerTests {

    @Container
    private static final MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:8.0.36");
    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewService reviewService;

    private static final Long POST_ID = 1L;

    @BeforeEach
    void setUp() {
        reset(reviewService);
    }

    @Test
    @Order(1)
    public void testCreateReview_Success() throws Exception {
        CreateNewReviewRequest reviewRequest = new CreateNewReviewRequest(POST_ID, true, "Looks good!");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest))
                        .header("role", "editor"))
                .andExpect(status().isOk());

        ArgumentCaptor<CreateNewReviewRequest> captor = ArgumentCaptor.forClass(CreateNewReviewRequest.class);
        verify(reviewService, times(1)).CreateNewReviewRequest(captor.capture());

        CreateNewReviewRequest capturedRequest = captor.getValue();
        assertEquals(POST_ID, capturedRequest.postId());
        assertTrue(capturedRequest.approved());
        assertEquals("Looks good!", capturedRequest.reviewMessage());
    }

    @Test
    @Order(2)
    public void testCreateReview_Forbidden() throws Exception {
        CreateNewReviewRequest reviewRequest = new CreateNewReviewRequest(POST_ID, false, "Needs improvement");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest))
                        .header("role", "user")) // Not an editor
                .andExpect(status().isForbidden());

        verify(reviewService, never()).CreateNewReviewRequest(any(CreateNewReviewRequest.class));
    }

    @Test
    @Order(3)
    public void testGetLatestReviewByPostId_Success() throws Exception {
        ReviewDto mockReview = new ReviewDto(true, "Great post!");

        when(reviewService.getLatestReviewByPostId(POST_ID)).thenReturn(mockReview);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/review/{postId}", POST_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(true))
                .andExpect(jsonPath("$.reviewMessage").value("Great post!"));

        verify(reviewService, times(1)).getLatestReviewByPostId(POST_ID);
    }

    @Test
    @Order(4)
    public void testGetLatestReviewByPostId_NotFound() throws Exception {
        when(reviewService.getLatestReviewByPostId(POST_ID)).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/review/{postId}", POST_ID))
                .andExpect(status().isOk())
                .andExpect(content().string("")); // Should return empty content

        verify(reviewService, times(1)).getLatestReviewByPostId(POST_ID);
    }
}
