import { Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../shared/models/Post';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {
  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author: ['', Validators.required]
  });

  onSubmit() {
    const newPost: Post = {
      ...this.postForm.value,
    }

    this.postService.createPost(newPost).subscribe(() => {
      this.postForm.reset();
    });
  }
}
