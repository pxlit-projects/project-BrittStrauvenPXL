import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PostReviewComponent } from './post-review.component';

describe('PostReviewComponent', () => {
  let component: PostReviewComponent;
  let fixture: ComponentFixture<PostReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // The component is standalone, so we include it in the `imports` array.
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
    // Provide a mock review object
    component.review = { reviewMessage: 'Content rejected due to policy' };
    fixture.detectChanges();

    // Query the rendered paragraph element
    const pEl = fixture.nativeElement.querySelector('p');
    expect(pEl.textContent).toContain('Content rejected due to policy');
  });

  it('should handle null or undefined review gracefully', () => {
    // If review is null, the safe-navigation operator in the template means it won't break
    component.review = null;
    fixture.detectChanges();

    // Query the rendered paragraph element
    const pEl = fixture.nativeElement.querySelector('p');
    // It should be an empty string (because review?.reviewMessage is undefined)
    expect(pEl.textContent.trim()).toBe('');
  });
});
