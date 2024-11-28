import { Routes } from '@angular/router';
import { NewPostComponent } from './post/new-post/new-post.component';

export const routes: Routes = [
    {path: 'posts', component: NewPostComponent},
    {path: '', redirectTo: 'posts', pathMatch: 'full'},
];
