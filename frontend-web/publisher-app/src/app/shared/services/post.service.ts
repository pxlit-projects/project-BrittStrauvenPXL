import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  api: string = environment.apiUrl +  "/post/api/post"
  http: HttpClient = inject(HttpClient);
  constructor() { }

  createPost(post: Post) {
    return this.http.post<Post>(this.api, post);
  }

  getPosts() {
    return this.http.get<Post[]>(this.api);
  }

  editPost(post: Post) {
    return this.http.put<Post>(this.api + "/" + post.id, post);
  }

  getPostById(id: number) {
    return this.http.get<Post>(this.api + "/" + id);
  }
}
