import { PostComment } from "./Comment";
import { Post } from "./Post";
import { Review } from "./Review";

export class PostDetail {
    post : Post;
    comments: PostComment[];
    review: Review | null | undefined;

    constructor(post: Post, comments: PostComment[], review: Review) {
        this.post = post;
        this.comments = comments;
        this.review = review;
    }
}