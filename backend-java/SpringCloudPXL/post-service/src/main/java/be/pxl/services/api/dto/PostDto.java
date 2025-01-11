package be.pxl.services.api.dto;

import be.pxl.services.domain.PostStatus;
import lombok.Data;
import lombok.Setter;


public record PostDto(Long id, String title, String content, String author, PostStatus postStatus, String creationDate) {
}
