package be.pxl.services.api.dto;

import java.time.LocalDate;

public record CommentDto(long id, long postId, String content, String commenter, LocalDate creationDate) {
}
