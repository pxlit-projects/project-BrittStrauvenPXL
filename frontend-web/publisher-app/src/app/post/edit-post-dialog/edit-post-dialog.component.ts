import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../shared/models/Post';

@Component({
  selector: 'app-edit-post-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.css'
})
export class EditPostDialogComponent {
  fb: FormBuilder = inject(FormBuilder);
  dialogRef: MatDialogRef<EditPostDialogComponent> = inject(MatDialogRef);
  data: Post = inject(MAT_DIALOG_DATA);

  editPostForm: FormGroup = this.fb.group({
    title: [this.data.title || '', Validators.required],
    content: [this.data.content || '', Validators.required],
  });

  saveAsConcept() {
    if (this.editPostForm.valid) {
      this.dialogRef.close({ ...this.editPostForm.value, isConcept: true, id: this.data.id });
    }
  }

  publish() {
    if (this.editPostForm.valid) {
      this.dialogRef.close({ ...this.editPostForm.value, isConcept: false, id: this.data.id });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
