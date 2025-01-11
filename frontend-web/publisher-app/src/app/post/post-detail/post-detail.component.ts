import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { PostDetail } from '../../shared/models/PostDetail';
import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PostActionsComponent } from '../post-actions/post-actions.component';
import { PostContentComponent } from '../post-content/post-content.component';
import { PostReviewComponent } from '../post-review/post-review.component';
import { PostEditFormComponent } from '../post-edit-form/post-edit-form.component';
import { PostHeaderComponent } from '../../post-header/post-header.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PostHeaderComponent, 
    PostActionsComponent, 
    PostContentComponent, 
    PostReviewComponent, 
    PostEditFormComponent, 
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  postForm!: FormGroup;
  post!: PostDetail;
  isEditMode = false;
  commentForm!: FormGroup;
  postId = this.route.snapshot.params['id'];
  editingCommentId: number | null = null;

  currentUser: string = this.authService.getUser().username;
  role: string = this.authService.getUser().role;

  ngOnInit() {
    this.loadPost();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.loadPost();
    });
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe((post) => {
      this.post = post;
      this.postForm = this.fb.group({
        title: [post.post.title, Validators.required],
        content: [post.post.content, Validators.required],
        author: [{ value: post.post.author, disabled: true }],
      });
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  goBack() {
    this.router.navigate(['/posts']);
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

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.loadPost(); // Reload post to reflect deleted comment
    });
  }

  editComment(comment: any) {
    this.editingCommentId = comment.id; // Track the comment being edited
    this.commentForm.patchValue({ content: comment.content });
  }

  cancelEditComment() {
    this.editingCommentId = null; // Reset edit mode
    this.commentForm.reset();
  }

  updateComment(comment: any) {
    if (this.commentForm.valid) {
      const updatedComment = {
        ...comment,
        content: this.commentForm.value.content,
      };
      this.commentService.updateComment(updatedComment).subscribe(() => {
        this.editingCommentId = null;
        this.loadPost();
        this.commentForm.reset();
      });
    }
  }

  onAddComment() {
    if (this.commentForm.valid) {
      const newComment = {
        postId: this.postId,
        ...this.commentForm.value,
      };
      this.commentService.createComment(newComment).subscribe(() => {
        this.loadPost();
        this.commentForm.reset();
      });
    }
  }
}
