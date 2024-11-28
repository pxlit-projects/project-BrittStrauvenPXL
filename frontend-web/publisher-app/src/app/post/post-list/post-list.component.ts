import { Component, inject } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';
import { PostFilterComponent } from "../post-filter/post-filter.component";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, MatDialogModule, PostFilterComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  postService: PostService = inject(PostService);
  dialog: MatDialog = inject(MatDialog);
  authService: AuthService = inject(AuthService);
  posts: Post[] = [];
  filteredPosts: Post[] = [];

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        const user = this.authService.getUser();
        this.posts = user.role === 'editor' ? posts : posts.filter(post => !post.isConcept);
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
    console.log('Applying filters:', criteria); // Debug log
    this.filteredPosts = this.posts
      .filter(post => 
        (!criteria.author || post.author.toLowerCase().includes(criteria.author.toLowerCase())) &&
        (!criteria.content || post.title.toLowerCase().includes(criteria.content.toLowerCase())) &&
        (!criteria.date || new Date(post.creationDate).toDateString() === new Date(criteria.date).toDateString())
      );
  }
}
