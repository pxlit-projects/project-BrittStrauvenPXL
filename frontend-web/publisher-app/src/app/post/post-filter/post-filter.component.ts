import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.css']
})
export class PostFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  filterCriteria = {
    author: '',
    content: '',
    date: ''
  };

  onFilterChange() {
    this.filterChanged.emit(this.filterCriteria);
  }

  resetFilters() {
    this.filterCriteria = { author: '', content: '', date: '' };
    this.filterChanged.emit(this.filterCriteria);
  }
}
