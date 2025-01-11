import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostEditFormComponent } from './post-edit-form.component';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('PostEditFormComponent', () => {
  let component: PostEditFormComponent;
  let fixture: ComponentFixture<PostEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostEditFormComponent,
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditFormComponent);
    component = fixture.componentInstance;

    component.postForm = new FormGroup({
      title: new FormControl('Test Title'),
      content: new FormControl('Test Content')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input postForm assigned', () => {
    expect(component.postForm).toBeDefined();
    expect(component.postForm.value).toEqual({
      title: 'Test Title',
      content: 'Test Content'
    });
  });

  it('should emit "save" event when saveChanges is called', () => {
    spyOn(component.save, 'emit');

    component.saveChanges(true);

    expect(component.save.emit).toHaveBeenCalledWith(true);
  });

  it('should emit "cancel" event when cancelEdit is called', () => {
    spyOn(component.cancel, 'emit');

    component.cancelEdit();

    // Expect the @Output cancel to emit (no payload)
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
