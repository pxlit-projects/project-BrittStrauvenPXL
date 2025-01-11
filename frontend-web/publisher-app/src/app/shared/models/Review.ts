export class Review {
    postId: number;
    approved: boolean;
    reviewMessage: string | null | undefined;

    constructor(postId: number, approved: boolean, reviewMessage: string) {
        this.postId = postId;
        this.approved = approved;
        this.reviewMessage = reviewMessage;
    }
}