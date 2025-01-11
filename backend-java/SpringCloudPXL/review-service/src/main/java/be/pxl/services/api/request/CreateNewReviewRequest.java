package be.pxl.services.api.request;

public record CreateNewReviewRequest(long postId, boolean approved, String reviewMessage) {
}
