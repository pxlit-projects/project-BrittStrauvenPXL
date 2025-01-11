import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-header',
  standalone: true,
  templateUrl: './post-header.component.html'
})
export class PostHeaderComponent {
  @Input() post!: any;
  @Output() back = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }
}
