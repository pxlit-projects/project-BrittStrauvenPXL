import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { Review } from '../models/Review';

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
    });
  }
}
