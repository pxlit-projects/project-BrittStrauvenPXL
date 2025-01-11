import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-review',
  standalone: true,
  templateUrl: './post-review.component.html'
})
export class PostReviewComponent {
  @Input() review!: any;
}
