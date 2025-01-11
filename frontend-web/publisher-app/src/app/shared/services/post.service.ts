import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { PostDetail } from '../models/PostDetail';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  api: string = environment.apiUrl +  "/post/api/post"
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  constructor() { }

  private getRoleHeader() : HttpHeaders {
    const role = this.authService.getUser().role;

    return new HttpHeaders({
      'role': role
    });

  }

  createPost(post: Post) {
    return this.http.post<Post>(this.api, post, {
      headers: this.getRoleHeader(),
    });
  }

  getPosts(filters?: any) {

    let params = new HttpParams();
    if (filters) {
      if (filters.author) params = params.set('author', filters.author);
      if (filters.content) params = params.set('content', filters.content);
      if (filters.date) params = params.set('date', filters.date);
    }
    return this.http.get<Post[]>(this.api, 
      {
        headers: this.getRoleHeader(),
        params: params
      }
    );
  }

  editPost(post: Post) {
    return this.http.put<Post>(this.api + "/" + post.id, post,
      {
        headers: this.getRoleHeader()
      }
    );
  }

  getPostById(id: number) {
    return this.http.get<PostDetail>(this.api + "/" + id, 
      {
        headers: this.getRoleHeader()
      }
    );
  }
}
