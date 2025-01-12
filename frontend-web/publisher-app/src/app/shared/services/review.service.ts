import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { Review } from '../models/Review';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  api: string = environment.apiUrl +  "/review/api/review"
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  constructor() { }

  private getRoleHeader() : HttpHeaders {
    const role = this.authService.getUser().role;

    return new HttpHeaders({
      'role': role
    });

  }

  createReview(review : Review) {
    return this.http.post<Review>(this.api, review, {
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
