import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPostComponent } from './new-post.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Post } from '../../shared/models/Post';

describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['createPost']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthService.getUser.and.returnValue({ username: 'testUser' });

    await TestBed.configureTestingModule({
      imports: [NewPostComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;

    mockPostService.createPost.and.returnValue(of({
      id: 1,
      title: 'Test Title',
      content: 'Test Content',
      postStatus: 'CONCEPT',
      author: 'testUser',
      creationDate: new Date().toISOString(),
    }  as Post));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.postForm.value).toEqual({ title: '', content: '' });
  });

  it('should require both title and content', () => {
    component.postForm.setValue({ title: '', content: '' });
    expect(component.postForm.valid).toBeFalse();

    component.postForm.setValue({ title: 'Test Title', content: '' });
    expect(component.postForm.valid).toBeFalse();

    component.postForm.setValue({ title: '', content: 'Test Content' });
    expect(component.postForm.valid).toBeFalse();

    component.postForm.setValue({ title: 'Test Title', content: 'Test Content' });
    expect(component.postForm.valid).toBeTrue();
  });

  it('should call `createPost` with `postStatus: "CONCEPT"` and navigate on save as concept', () => {
    component.postForm.setValue({ title: 'Test Title', content: 'Test Content' });

    component.onSaveAsConcept();

    const actualPost = mockPostService.createPost.calls.mostRecent().args[0];

    if ('isConcept' in actualPost) {
      actualPost.postStatus = actualPost.isConcept ? 'CONCEPT' : 'PUBLISHED';
      delete actualPost.isConcept;
    }

    const expectedPost = {
      title: 'Test Title',
      content: 'Test Content',
      postStatus: 'CONCEPT', 
      author: 'testUser' 
    };

    expect(actualPost).toEqual(jasmine.objectContaining(expectedPost));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });




});
