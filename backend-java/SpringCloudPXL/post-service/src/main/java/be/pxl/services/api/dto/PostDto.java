package be.pxl.services.api.dto;

import lombok.Data;
import lombok.Setter;


public record PostDto(Long id, String title, String content, String author, boolean isConcept) {
}
