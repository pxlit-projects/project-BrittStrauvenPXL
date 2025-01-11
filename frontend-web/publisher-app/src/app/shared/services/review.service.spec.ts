import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';
import { Review } from '../models/Review';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);

    mockAuthService.getUser.and.returnValue({ role: 'USER' });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a review (POST)', () => {
    const newReview: Review = {
      postId: 123,
      approved: false,
      reviewMessage: 'Needs more detail',
    };

    const createdReview: Review = {
      postId: 123,
      approved: true,
      reviewMessage: 'Updated after further review',
    };

    service.createReview(newReview).subscribe((res) => {
      expect(res).toEqual(createdReview);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/api/review`);
    expect(req.request.method).toBe('POST');

    expect(req.request.headers.get('role')).toBe('USER');

    req.flush(createdReview);
  });

  it('should handle errors from createReview (optional)', () => {
    const failingReview: Review = {
      postId: 999,
      approved: false,
      reviewMessage: 'Will fail',
    };

    service.createReview(failingReview).subscribe({
      next: () => fail('Expected an error, but got success response'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/api/review`);
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Something went wrong' }, { status: 500, statusText: 'Internal Server Error' });
  });
});
