import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-actions',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './post-actions.component.html'
})
export class PostActionsComponent {
  @Input() post!: any;
  @Output() edit = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }
}
