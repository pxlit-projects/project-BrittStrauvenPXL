import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../shared/services/post.service';
import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PostDetail } from '../../shared/models/PostDetail';
import { Post } from '../../shared/models/Post';
import { PostComment } from '../../shared/models/Comment';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: Router;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPostById', 'editPost']);
    mockCommentService = jasmine.createSpyObj('CommentService', ['deleteComment', 'updateComment', 'createComment']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of(new NavigationEnd(0, '/', '/')),
    } as unknown as Router;

    mockActivatedRoute = { snapshot: { params: { id: 1 } } };

    mockAuthService.getUser.and.returnValue({ username: 'testUser' });

    await TestBed.configureTestingModule({
      imports: [
        PostDetailComponent,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;

    const mockPostDetail: PostDetail = {
      post: {
        id: 1,
        title: 'Test Post',
        content: 'Post content',
        author: 'Author',
        postStatus: 'PUBLISHED',
        creationDate: new Date().toISOString()
      },
      comments: [
        {
          id: 101,
          postId: 1,
          content: 'Test comment',
          commenter: 'Commenter',
          creationDate: new Date().toISOString(),
        } as PostComment,
      ],
      review: { postId: 1, approved: true, reviewMessage: 'Approved' },
    };

    mockPostService.getPostById.and.returnValue(of(mockPostDetail));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post data on initialization', () => {
    expect(mockPostService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post.post.title).toBe('Test Post');
    expect(component.post.review?.reviewMessage).toBe('Approved');
  });

  it('should call editPost with correct data (isConcept=true)', () => {
    component.postForm.setValue({
      title: 'Updated Title',
      content: 'Updated Content',
      author: 'Author'
    });

    mockPostService.editPost.and.returnValue(
      of({
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content',
        creationDate: new Date().toISOString(),
      } as Post)
    );

    component.saveChanges(true);

    expect(mockPostService.editPost).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Updated Title',
        content: 'Updated Content',
        isConcept: true,
        id: 1
      })
    );
  });

  it('should toggle edit mode', () => {
    expect(component.isEditMode).toBeFalse();
    component.toggleEditMode();
    expect(component.isEditMode).toBeTrue();
  });

  it('should navigate back to posts when goBack() is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should delete a comment and reload post', () => {
    mockCommentService.deleteComment.and.returnValue(of({}));
    component.deleteComment(101);

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(101);
    expect(mockPostService.getPostById).toHaveBeenCalledTimes(3);
  });

  it('should enter edit mode for a comment', () => {
    const comment = { id: 101, content: 'Original comment' } as PostComment;
    component.editComment(comment);

    expect(component.editingCommentId).toBe(101);
    expect(component.commentForm.value.content).toBe('Original comment');
  });

  it('should reset edit mode for a comment', () => {
    component.commentForm.patchValue({ content: 'Some content' });
    component.cancelEditComment();

    expect(component.editingCommentId).toBeNull();
    expect(component.commentForm.value.content).toBeNull();
  });

  it('should not call editPost if postForm is invalid', () => {
    component.postForm.setValue({ title: '', content: '', author: 'Author' });

    component.saveChanges(true);
    expect(mockPostService.editPost).not.toHaveBeenCalled();
  });

  it('should call editPost with isConcept=false if form is valid', () => {
    component.postForm.setValue({
      title: 'Another Title',
      content: 'Another Content',
      author: 'Author'
    });

    mockPostService.editPost.and.returnValue(of({
      id: 1,
      title: 'Another Title',
      content: 'Another Content',
      creationDate: new Date().toISOString()
    } as Post));

    component.saveChanges(false);

    expect(mockPostService.editPost).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Another Title',
        content: 'Another Content',
        isConcept: false,
        id: 1
      })
    );
  });

  it('should not update comment if commentForm is invalid', () => {
    const comment = { id: 101, content: 'Old comment' } as PostComment;
    component.editComment(comment);

    component.commentForm.patchValue({ content: '' });

    component.updateComment(comment);
    expect(mockCommentService.updateComment).not.toHaveBeenCalled();
  });

  it('should update comment if commentForm is valid', () => {
    const comment = { id: 101, content: 'Old comment' } as PostComment;
    component.editComment(comment);

    component.commentForm.patchValue({ content: 'New content' });
    mockCommentService.updateComment.and.returnValue(
      of({
        id: 101,
        postId: 1,
        content: 'Updated comment',
        commenter: 'Someone',
        creationDate: new Date().toISOString()
      } as any)
    );
    
    
    component.updateComment(comment);
    expect(mockCommentService.updateComment).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 101, content: 'New content' })
    );
  });

  it('should not create comment if commentForm is invalid', () => {
    component.commentForm.setValue({ content: '' });

    component.onAddComment();
    expect(mockCommentService.createComment).not.toHaveBeenCalled();
  });

  it('should create comment if commentForm is valid', () => {
    mockCommentService.createComment.and.returnValue(
      of({
        id: 102,
        postId: 1,
        content: 'New comment',
        commenter: 'Someone Else',
        creationDate: new Date().toISOString()
      } as any)
    ); 
    component.commentForm.setValue({ content: 'New comment' });

    component.onAddComment();
    expect(mockCommentService.createComment).toHaveBeenCalledWith(
      jasmine.objectContaining({
        postId: 1,
        content: 'New comment'
      })
    );
  });

});
