export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    isConcept: boolean;

    constructor(title: string, content: string, author: string, isConcept: boolean, id: number) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.isConcept = isConcept;
        this.id = id;
    }
}
