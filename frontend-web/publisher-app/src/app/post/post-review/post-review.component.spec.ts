import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PostReviewComponent } from './post-review.component';

describe('PostReviewComponent', () => {
  let component: PostReviewComponent;
  let fixture: ComponentFixture<PostReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostReviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the review message if provided', () => {
    component.review = { reviewMessage: 'Content rejected due to policy' };
    fixture.detectChanges();

    const pEl = fixture.nativeElement.querySelector('p');
    expect(pEl.textContent).toContain('Content rejected due to policy');
  });

  it('should handle null or undefined review gracefully', () => {
    component.review = null;
    fixture.detectChanges();

    const pEl = fixture.nativeElement.querySelector('p');
    expect(pEl.textContent.trim()).toBe('');
  });
});
