import { Component, inject } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostFilterComponent } from "../post-filter/post-filter.component";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, MatDialogModule, PostFilterComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})

export class PostListComponent {
  postService: PostService = inject(PostService);
  authService : AuthService = inject(AuthService);
  dialog: MatDialog = inject(MatDialog);
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  role: string  = "";

  ngOnInit() {
    this.fetchPosts();
    this.role = this.authService.getUser().role;
  }

  fetchPosts(filters?: any) {
    this.postService.getPosts(filters).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = [...this.posts];
      },
      error: (err) => {
        const errorElement = document.getElementById('error');
        if (errorElement) {
          errorElement.innerText = err.message || 'Error fetching posts';
        }
      }
    });
  }
  
  applyFilters(criteria: any) {
    this.fetchPosts(criteria);
  }
  
}
