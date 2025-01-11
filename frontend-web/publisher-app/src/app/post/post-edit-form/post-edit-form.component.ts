import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-edit-form.component.html'
})
export class PostEditFormComponent {
  @Input() postForm!: FormGroup;
  @Output() save = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();

  saveChanges(isConcept: boolean) {
    this.save.emit(isConcept);
  }

  cancelEdit() {
    this.cancel.emit();
  }
}
