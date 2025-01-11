export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    postStatus : string;
    creationDate: string;

    constructor(title: string, content: string, author: string, status: string, id: number, creationDate: string) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.postStatus = status;
        this.id = id;
        this.creationDate = creationDate;
    }
}
