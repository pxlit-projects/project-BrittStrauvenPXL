import { Routes } from '@angular/router';
import { NewPostComponent } from './post/new-post/new-post.component';
import { LoginComponent } from './login/login.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'new-post', component: NewPostComponent},
    {path: 'post-detail/:id', component: PostDetailComponent},
    {path: 'posts', component: PostListComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
