import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFilterComponent } from './post-filter.component';
import { FormsModule } from '@angular/forms';

describe('PostFilterComponent', () => {
  let component: PostFilterComponent;
  let fixture: ComponentFixture<PostFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostFilterComponent, 
        FormsModule          
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged when onFilterChange is called', () => {
    spyOn(component.filterChanged, 'emit');

    component.filterCriteria.author = 'John Doe';
    component.filterCriteria.content = 'Angular Tips';
    component.filterCriteria.date = '2025-01-01';

    component.onFilterChange();

    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      author: 'John Doe',
      content: 'Angular Tips',
      date: '2025-01-01'
    });
  });

  it('should reset filters and emit filterChanged when resetFilters is called', () => {
    spyOn(component.filterChanged, 'emit');

    component.filterCriteria.author = 'Jane';
    component.filterCriteria.content = 'Some content';
    component.filterCriteria.date = '2024-12-31';

    component.resetFilters();

    expect(component.filterCriteria).toEqual({ author: '', content: '', date: '' });
    expect(component.filterChanged.emit).toHaveBeenCalledWith({ author: '', content: '', date: '' });
  });
});
