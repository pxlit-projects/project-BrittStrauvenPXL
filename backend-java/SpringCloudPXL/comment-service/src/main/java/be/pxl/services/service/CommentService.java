package be.pxl.services.service;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.api.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.service.converter.CommentConverter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentConverter commentConverter;

    public CommentService(CommentRepository commentRepository, CommentConverter commentConverter) {
        this.commentRepository = commentRepository;
        this.commentConverter = commentConverter;
    }

    public void createNewComment(CommentRequest commentRequest, String user) {
        Comment comment = new Comment();
        comment.setPostId(commentRequest.postId());
        comment.setContent(commentRequest.content());
        comment.setCommenter(user);
        comment.setCreationDate(LocalDate.now());

        commentRepository.save(comment);
    }

    public List<CommentDto> getAllCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId).stream()
                .map(commentConverter::convert)
                .toList();
    }

    public void deleteComment(Long id, String user) {
        if (commentRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Comment not found");
        }
        if (commentRepository.findByIdAndCommenter(id, user).isEmpty()) {
            throw new IllegalArgumentException("This comment is not yours");
        }
        commentRepository.deleteById(id);
    }

    public void putComment(Long id, CommentRequest commentRequest, String user) {
        if (commentRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Comment not found");
        }
        if (commentRepository.findByIdAndCommenter(id, user).isEmpty()) {
            throw new IllegalArgumentException("This comment is not yours");
        }
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setContent(commentRequest.content());
        commentRepository.save(comment);
    }


}
