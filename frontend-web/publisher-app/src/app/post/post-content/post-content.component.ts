import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-content',
  standalone: true,
  templateUrl: './post-content.component.html'
})
export class PostContentComponent {
  @Input() post!: any;
}
