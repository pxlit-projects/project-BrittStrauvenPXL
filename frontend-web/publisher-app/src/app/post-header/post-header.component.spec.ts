import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PostHeaderComponent } from './post-header.component';

describe('PostHeaderComponent', () => {
  let component: PostHeaderComponent;
  let fixture: ComponentFixture<PostHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should accept a post as input', () => {
    const mockPost = { title: 'My Post', content: 'Some content' };
    component.post = mockPost;
    fixture.detectChanges();

    expect(component.post).toEqual(mockPost);
  });

  it('should emit "back" event when goBack is called (click)', () => {
    spyOn(component.back, 'emit');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.back.emit).toHaveBeenCalled();
  });
});
