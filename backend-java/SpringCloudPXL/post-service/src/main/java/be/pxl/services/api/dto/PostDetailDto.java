package be.pxl.services.api.dto;

import be.pxl.services.domain.Post;

import java.util.List;

public record PostDetailDto (PostDto post, List<CommentDto> comments, ReviewDto review){
}
