package be.pxl.services.service.converter;

import be.pxl.services.api.dto.CommentDto;
import be.pxl.services.domain.Comment;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Service;

@Service
public class CommentConverter implements Converter<Comment, CommentDto> {
    @Override
    public CommentDto convert(Comment source) {
        return new CommentDto(
                source.getId(),
                source.getPostId(),
                source.getContent(),
                source.getCommenter(),
                source.getCreationDate()
        );
    }
}
