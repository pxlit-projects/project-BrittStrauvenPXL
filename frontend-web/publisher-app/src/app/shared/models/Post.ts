export class Post {
    id: number;
    title: string;
    content: string;
    author: string;
    isConcept: boolean;
    creationDate: string;

    constructor(title: string, content: string, author: string, isConcept: boolean, id: number, creationDate: string) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.isConcept = isConcept;
        this.id = id;
        this.creationDate = creationDate;
    }
}
