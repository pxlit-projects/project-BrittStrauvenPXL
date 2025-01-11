import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';
import { PostComment } from '../models/Comment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a spy for AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    // Configure the testing module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    // Inject our service and HttpTestingController
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

  it('should create a comment (POST)', () => {
    const mockComment = { postId: 123, content: 'Test content' };
    const createdComment = { id: 999, ...mockComment } as PostComment;
  
    service.createComment(mockComment).subscribe((res) => {
      expect(res as unknown as PostComment).toEqual(createdComment);
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment`);
    expect(req.request.method).toBe('POST');
    req.flush(createdComment);
  });
  

  it('should update a comment (PUT)', () => {
    const mockComment = { id: 999, postId: 123, content: 'Updated content' };
    const updatedComment = { ...mockComment } as PostComment;
  
    service.updateComment(mockComment).subscribe((res) => {
      expect(res as unknown as PostComment).toEqual(updatedComment);
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedComment);
  });

  it('should delete a comment (DELETE)', () => {
    service.deleteComment(999).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/comment/api/comment/999`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('user')).toBe('testUser');
    expect(req.request.headers.get('role')).toBe('USER');
    req.flush({ success: true });
  });
});
