import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { PostListComponent } from './post-list.component';
import { PostService } from '../../shared/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../shared/models/Post';
import { AuthService } from '../../shared/services/auth.service';

describe('PostListComponent', () => {
  let fixture: ComponentFixture<PostListComponent>;
  let component: PostListComponent;

  let mockPostService: jasmine.SpyObj<PostService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPosts']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockAuthService.getUser.and.returnValue({ role: 'editor' });


    await TestBed.configureTestingModule({
      imports: [PostListComponent, RouterTestingModule],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchPosts on ngOnInit', () => {
    mockPostService.getPosts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(mockPostService.getPosts).toHaveBeenCalled();
  });

  it('should call fetchPosts with given criteria in applyFilters()', () => {
    spyOn(component, 'fetchPosts');
    const testCriteria = { date: '2025-01-01', author: 'Alice' };

    component.applyFilters(testCriteria);
    expect(component.fetchPosts).toHaveBeenCalledWith(testCriteria);
  });

  it('should fetch posts with filters when fetchPosts is called', () => {
    const filters = { author: 'John Doe' };
    mockPostService.getPosts.and.returnValue(of([]));

    component.fetchPosts(filters);
    expect(mockPostService.getPosts).toHaveBeenCalledWith(filters);
  });

  it('should set posts and filteredPosts on successful fetch', () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Test Title',
        content: 'Test Content',
        author: 'Tester',
        postStatus: 'PUBLISHED',
        creationDate: '2024-01-01'
      }
    ];
    mockPostService.getPosts.and.returnValue(of(mockPosts));

    component.fetchPosts();
    expect(component.posts).toEqual(mockPosts);
    expect(component.filteredPosts).toEqual(mockPosts);
  });

  it('should display error message in DOM if fetch fails', () => {
    document.body.innerHTML = '<div id="error"></div>';
    mockPostService.getPosts.and.returnValue(throwError(() => new Error('Failed to fetch posts')));

    component.fetchPosts();
    const errorElement = document.getElementById('error');
    expect(errorElement?.innerText).toBe('Failed to fetch posts');
  });

  it('should display correct post statuses', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Concept Post', author: 'Alice', postStatus: 'CONCEPT', creationDate: '2024-01-01', content: 'Test Content' },
      { id: 2, title: 'Approved Post', author: 'Bob', postStatus: 'APPROVED', creationDate: '2024-01-01', content: 'Test Content' },
      { id: 3, title: 'Rejected Post', author: 'Charlie', postStatus: 'REJECTED', creationDate: '2024-01-01', content: 'Test Content' },
      { id: 4, title: 'Published Post', author: 'Dave', postStatus: 'PUBLISHED', creationDate: '2024-01-01', content: 'Test Content' },
    ];
    mockPostService.getPosts.and.returnValue(of(mockPosts));
  
    component.fetchPosts();
    fixture.detectChanges();
  
    expect(component.posts.length).toBe(4);
    expect(component.posts[0].postStatus).toBe('CONCEPT');
    expect(component.posts[1].postStatus).toBe('APPROVED');
    expect(component.posts[2].postStatus).toBe('REJECTED');
    expect(component.posts[3].postStatus).toBe('PUBLISHED');
  });
});
