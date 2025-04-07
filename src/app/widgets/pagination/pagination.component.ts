import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginationMetaInterface} from "../../interfaces/global";

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  standalone: true,
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() meta: PaginationMetaInterface = {
    perPage: 10,
    totalCount: 0,
    currentPage: 1,
    currentCount: 0,
  };

  @Output() pageChangeEvent = new EventEmitter<number>;

  changePage(next: boolean) {
    if (next) {
      this.pageChangeEvent.emit(++this.meta.currentPage)
    } else this.pageChangeEvent.emit(--this.meta.currentPage)
  }
}
