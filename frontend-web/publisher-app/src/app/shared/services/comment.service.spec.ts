// comment.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';
import { PostComment as AppPostComment, PostComment } from '../models/Comment'; // Aliased import

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);

    mockAuthService.getUser.and.returnValue({
      username: 'testUser',
      role: 'USER'
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createComment', () => {
    it('should send a POST request with correct headers and body', () => {
      // Arrange
      const newComment = {
        postId: 123,
        content: 'This is a test comment.'
      };
      const mockCreatedComment: AppPostComment = new AppPostComment(
        newComment.postId,
        newComment.content!,
        'testUser',
        999,
        new Date().toISOString()
      );

      service.createComment(newComment).subscribe((res) => {
        expect(res as unknown as PostComment).toEqual(mockCreatedComment);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('user')).toBe('testUser');
      expect(req.request.headers.get('role')).toBe('USER');
      expect(req.request.body).toEqual(newComment);

      req.flush(mockCreatedComment as any);
    });

    it('should handle HTTP errors gracefully', () => {
      const newComment = {
        postId: 123,
        content: 'This is a test comment.'
      };
      const mockError = {
        status: 500,
        statusText: 'Internal Server Error'
      };

      service.createComment(newComment).subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment`);
      expect(req.request.method).toBe('POST');

      req.flush({ message: 'Something went wrong' }, mockError);
    });
  });

  describe('#updateComment', () => {
    it('should send a PUT request with correct headers and body', () => {
      // Arrange
      const updatedComment = {
        id: 999,
        postId: 123,
        content: 'Updated comment content.'
      };
      const mockUpdatedComment: AppPostComment = new AppPostComment(
        updatedComment.postId,
        updatedComment.content!,
        'testUser',
        updatedComment.id,
        new Date().toISOString()
      );

      // Act
      service.updateComment(updatedComment).subscribe((res) => {
        // Assert
        expect(res as unknown as PostComment).toEqual(mockUpdatedComment);
      });

      // Assert
      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('user')).toBe('testUser');
      expect(req.request.headers.get('role')).toBe('USER');
      expect(req.request.body).toEqual(updatedComment);

      req.flush(mockUpdatedComment as any);
    });

    it('should handle HTTP errors gracefully', () => {
      const updatedComment = {
        id: 999,
        postId: 123,
        content: 'Updated comment content.'
      };
      const mockError = {
        status: 404,
        statusText: 'Not Found'
      };

      service.updateComment(updatedComment).subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
      expect(req.request.method).toBe('PUT');

      req.flush({ message: 'Comment not found' }, mockError);
    });
  });

  describe('#deleteComment', () => {
    it('should send a DELETE request with correct headers', () => {
      const commentId = 999;

      service.deleteComment(commentId).subscribe((res) => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('user')).toBe('testUser');
      expect(req.request.headers.get('role')).toBe('USER');

      req.flush({ success: true } as any);
    });

    it('should handle HTTP errors gracefully', () => {
      const commentId = 999;
      const mockError = {
        status: 403,
        statusText: 'Forbidden'
      };

      service.deleteComment(commentId).subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(error.statusText).toBe('Forbidden');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
      expect(req.request.method).toBe('DELETE');

      req.flush({ message: 'Forbidden' }, mockError);
    });
  });
});
