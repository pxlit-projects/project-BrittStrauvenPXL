package be.pxl.services.api.request;

public record CreatePostRequest(String title, String content, String author, boolean isConcept) {
}
