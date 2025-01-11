export class PostComment {
    id: number;
    postId: number;
    content: string | null | undefined;
    commenter: string;
    creationDate: string;

    constructor(postId: number, content: string, commenter: string, id: number, creationDate: string) {
        this.postId = postId;
        this.content = content;
        this.commenter = commenter;
        this.id = id;
        this.creationDate = creationDate;
    }
}