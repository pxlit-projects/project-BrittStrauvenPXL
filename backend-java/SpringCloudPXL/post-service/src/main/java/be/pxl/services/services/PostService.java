package be.pxl.services.services;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.dto.PostDetailDto;
import be.pxl.services.api.dto.PostDto;
import be.pxl.services.api.dto.ReviewDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.client.CommentClient;
import be.pxl.services.client.ReviewClient;
import be.pxl.services.domain.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.converter.PostConverter;
import io.micrometer.common.util.StringUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostConverter postConverter;
    private final MailService mailService;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    private final CommentClient commentClient;
    private final ReviewClient reviewClient;


    public PostService(PostRepository postRepository, PostConverter postConverter, MailService mailService, CommentClient commentClient, ReviewClient reviewClient) {
        this.postRepository = postRepository;
        this.postConverter = postConverter;
        this.mailService = mailService;
        this.commentClient = commentClient;
        this.reviewClient = reviewClient;
    }

    public void createNewPost(CreatePostRequest request) {
        Post post = new Post();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setAuthor(request.author());
        post.setCreationDate(LocalDate.now());
        if (request.isConcept()) {
            post.setStatus(PostStatus.CONCEPT);
        } else {
            post.setStatus(PostStatus.PUBLISHED);
        }
        postRepository.save(post);
    }

    public void editPost(long id, CreatePostRequest request) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setTitle(request.title());
        post.setContent(request.content());
        if (request.isConcept()) {
            post.setStatus(PostStatus.CONCEPT);
        } else {
            post.setStatus(PostStatus.PUBLISHED);
        }
        postRepository.save(post);
    }

    public PostDetailDto getPostById(long id) {
        PostDto post = postRepository.findById(id)
                .map(postConverter::convert)
                .orElseThrow();
        List<CommentDto> comments = commentClient.getAllCommentsByPostId(id);
        ReviewDto review = reviewClient.getReviewByPostId(id);

        return new PostDetailDto(post, comments, review);
    }

    public List<PostDto> getFilteredPosts(String author, String content, String date) {
        LocalDate parsedDate = null;
        if (date != null && !date.isEmpty()) {
            try {
                parsedDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD.");
            }
        }

        return postRepository.findFilteredPosts(author, content, parsedDate).stream()
                .map(postConverter::convert)
                .collect(Collectors.toList());
    }

    public List<PostDto> getFilteredPublishedPosts(String author, String content, String date) {
        LocalDate parsedDate = null;
        if (date != null && !date.isEmpty()) {
            try {
                parsedDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD.");
            }
        }

        return postRepository.findFilteredPublishedPosts(author, content, parsedDate).stream()
                .map(postConverter::convert)
                .collect(Collectors.toList());
    }

    @RabbitListener(queues = "reviewQueue", containerFactory = "rabbitListenerContainerFactory")
    public void receiveReview(Review review) {
        logger.info("Received review: " + review.toString());
        Post post = postRepository.findById(review.getPostId()).orElseThrow();

        if (post.getStatus() == PostStatus.PUBLISHED) {
            logger.info("This post has already been published");
        }

        if (review.isApproved()) {
            logger.info("Review approved");
            post.setStatus(PostStatus.APPROVED);
            postRepository.save(post);
        } else {
            logger.info("Review rejected");
            post.setStatus(PostStatus.REJECTED);
            postRepository.save(post);
        }

        StringBuilder message = new StringBuilder();
        message.append("New review available for post ").append(post.getTitle()).append(" - ");
        message.append(" The post has been  ").append(post.getStatus().toString().toLowerCase());
        if (!StringUtils.isBlank(review.getReviewMessage())) {
            message.append(" with comment: ").append(review.getReviewMessage());
        }

        mailService.sendEmail("strauvenbritt@gmail.com", "Review received", message.toString() + post.getId());
    }
}
