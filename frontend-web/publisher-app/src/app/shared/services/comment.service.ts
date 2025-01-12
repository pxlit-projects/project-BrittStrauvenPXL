import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  api: string = environment.apiUrl +  "/comment/api/comment"
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  constructor() { }

  private getRoleHeader() : HttpHeaders {
    const role = this.authService.getUser().role;
    const user = this.authService.getUser().username;
    
    return new HttpHeaders({
      'user' : user,
      'role': role
    });
  }

  createComment(comment: any) {
    return this.http.post<Comment>(this.api, comment, {
      headers: this.getRoleHeader(),
    }).pipe(catchError(this.handleError));
  }

  updateComment(comment: any) {
    return this.http.put<Comment>(this.api + "/" + comment.id, comment, {
      headers: this.getRoleHeader(),
    }).pipe(catchError(this.handleError));
  }

  deleteComment(id: number) {
    return this.http.delete(this.api + "/" + id, {
      headers: this.getRoleHeader(),
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(() => error); 
  }
}
