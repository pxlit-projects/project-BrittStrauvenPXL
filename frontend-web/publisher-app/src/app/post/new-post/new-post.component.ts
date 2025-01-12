import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../shared/models/Post';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  isFormSubmitted : boolean = false;

  onSaveAsConcept() {
    const conceptPost: Post = {
      ...this.postForm.value,
      isConcept: true,
      author: this.authService.getUser().username
    };

    this.postService.createPost(conceptPost).subscribe(() => {
      this.postForm.reset();
      this.isFormSubmitted = true;
      this.router.navigate(['/posts']);
    });
  }

  goBack() {
    this.router.navigate(['/posts']);
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.isFormSubmitted || this.postForm.pristine) {
      return true;
    }
    return confirm('You have unsaved changes. Are you sure you want to leave?');
  }
}
