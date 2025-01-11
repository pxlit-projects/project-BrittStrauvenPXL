import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReviewComponent } from './new-review.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ReviewService } from '../shared/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Review } from '../shared/models/Review';

describe('NewReviewComponent', () => {
  let component: NewReviewComponent;
  let fixture: ComponentFixture<NewReviewComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockReviewService = jasmine.createSpyObj('ReviewService', ['createReview']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    mockActivatedRoute = { snapshot: { params: { id: 1 } } };

    await TestBed.configureTestingModule({
      imports: [
        NewReviewComponent,  
        RouterTestingModule, 
        FormsModule          
      ],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReviewComponent);
    component = fixture.componentInstance;

    mockReviewService.createReview.and.returnValue(of({
      postId: 1,
      approved: true,
      reviewMessage: ''
    } as Review));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct postId from ActivatedRoute', () => {
    expect(component.postId).toBe(1);
  });

  it('should have an empty review model initially', () => {
    expect(component.review).toEqual({ approved: '', rejectionReason: '' });
  });

  it('should clear `rejectionReason` when `approved` is set to "approve"', () => {
    component.review.approved = 'approve';
    component.onApprovalChange('approve');

    expect(component.review.rejectionReason).toBe('');
  });

  it('should call `createReview` and navigate on form submit (approved case)', async () => {
    spyOn(component.reviewSubmitted, 'emit');

    component.review = { approved: 'approve', rejectionReason: '' };

    const mockForm = jasmine.createSpyObj<NgForm>('NgForm', [], { invalid: false });
    mockForm.resetForm = jasmine.createSpy();

    await component.onSubmit(mockForm);

    await fixture.whenStable();

    expect(mockReviewService.createReview).toHaveBeenCalledWith({
      postId: 1,
      approved: true,
      reviewMessage: ''
    });

    expect(component.reviewSubmitted.emit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post-detail', 1]);
  });

  it('should include rejection message when rejected', async () => {
    spyOn(component.reviewSubmitted, 'emit');

    component.review = { approved: 'reject', rejectionReason: 'Not detailed enough' };

    const mockForm = jasmine.createSpyObj<NgForm>('NgForm', [], { invalid: false });
    mockForm.resetForm = jasmine.createSpy();

    await component.onSubmit(mockForm);

    await fixture.whenStable();

    expect(mockReviewService.createReview).toHaveBeenCalledWith({
      postId: 1,
      approved: false,
      reviewMessage: 'Not detailed enough'
    });

    expect(component.reviewSubmitted.emit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post-detail', 1]);
  });

  it('should NOT submit the form if invalid', async () => {
    spyOn(component.reviewSubmitted, 'emit');

    // Mock form as invalid
    const mockForm = jasmine.createSpyObj<NgForm>('NgForm', [], { invalid: true });

    await component.onSubmit(mockForm);

    expect(mockReviewService.createReview).not.toHaveBeenCalled();
    expect(component.reviewSubmitted.emit).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should update rejectionReason field when user selects "reject"', () => {
    component.review.approved = 'reject';
    fixture.detectChanges();

    const rejectionReasonInput = fixture.nativeElement.querySelector('#rejectionReason');
    expect(rejectionReasonInput).toBeTruthy();
  });

  it('should hide rejectionReason field when user selects "approve"', () => {
    component.review.approved = 'approve';
    fixture.detectChanges();

    const rejectionReasonInput = fixture.nativeElement.querySelector('#rejectionReason');
    expect(rejectionReasonInput).toBeFalsy();
  });
});
