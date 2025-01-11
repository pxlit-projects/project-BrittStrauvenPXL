import { Routes } from '@angular/router';
import { NewPostComponent } from './post/new-post/new-post.component';
import { LoginComponent } from './login/login.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';
import { NewReviewComponent } from './new-review/new-review.component';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'new-post', component: NewPostComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'post-detail/:id', component: PostDetailComponent},
    {path: 'posts', component: PostListComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'new-review/:id', component: NewReviewComponent}
];
