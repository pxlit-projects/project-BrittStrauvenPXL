import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../shared/models/Post';
import { PostService } from '../../shared/services/post.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

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

  onSubmit() {
    const newPost: Post = {
      ...this.postForm.value,
      author: this.authService.getUser().username,
      isConcept: false
    };

    this.postService.createPost(newPost).subscribe(() => {
      this.postForm.reset();
    });
    this.router.navigate(['/posts']);
  }

  onSaveAsConcept() {
    const conceptPost: Post = {
      ...this.postForm.value,
      isConcept: true,
      author: this.authService.getUser().username
    
    };

    this.postService.createPost(conceptPost).subscribe(() => {
      this.postForm.reset();
    });
    this.router.navigate(['/posts']);
  }
}
