import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ReviewService } from '../shared/services/review.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Review } from '../shared/models/Review';

@Component({
  selector: 'app-new-review',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-review.component.html',
  styleUrl: './new-review.component.css'
})
export class NewReviewComponent {
  reviewService: ReviewService = inject(ReviewService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  postId = this.route.snapshot.params['id'];

  @Output() reviewSubmitted = new EventEmitter<void>();

  review = {
    approved: '',
    rejectionReason: ''
  };

  onApprovalChange(value: string) {
    if (value === 'approve') {
      this.review.rejectionReason = '';
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const isApproved = this.review.approved === 'approve';

    const newReview: Review = {
      postId: this.postId,
      approved: isApproved,
      reviewMessage: isApproved ? '' : this.review.rejectionReason
    };

    this.reviewService.createReview(newReview).subscribe(() => {
      form.resetForm();
      this.reviewSubmitted.emit();
      this.router.navigate(['/post-detail', this.postId]);
    });
  }
}
