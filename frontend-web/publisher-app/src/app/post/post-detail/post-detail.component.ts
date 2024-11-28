import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  postForm!: FormGroup;
  post!: Post;
  isEditMode = false;
  postId = this.route.snapshot.params['id'];

  ngOnInit() {
    this.loadPost();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe((post) => {
      this.post = post;

      // Initialize the form with post data
      this.postForm = this.fb.group({
        title: [post.title, Validators.required],
        content: [post.content, Validators.required],
        author: [{ value: post.author, disabled: true }], // Author field is read-only
      });
    });
  }

  saveChanges(isConcept: boolean) {
    if (this.postForm.valid) {
      const updatedPost = { ...this.postForm.value, isConcept: isConcept, id: this.postId };
      this.postService.editPost(updatedPost).subscribe(() => {
        this.isEditMode = false;
        this.loadPost();
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
  }
}
