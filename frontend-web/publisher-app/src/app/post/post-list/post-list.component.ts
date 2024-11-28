import { Component, inject } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import { RouterLink } from '@angular/router';
import { EditPostDialogComponent } from '../edit-post-dialog/edit-post-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, MatDialogModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  postService: PostService = inject(PostService);
  dialog: MatDialog = inject(MatDialog);
  posts: Post[] = []

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.postService.getPosts().subscribe({
      next: posts => {
        this.posts = posts;
        console.log(posts);
      },
      error: (err) => {
        const errorElement = document.getElementById('error');
        if (errorElement) {
          errorElement.innerText = err;
        }
      }
    })
  }

  openEditDialog(post: Post) {
    const dialog = this.dialog.open(EditPostDialogComponent, {
      width: "400px",
      data: { ...post },
    });

    dialog.afterClosed().subscribe((editedPost: Post) => {
      if (editedPost) {
        this.postService.editPost(editedPost).subscribe(() => {
          this.fetchPosts();
        });
      }
    });
  }
}
