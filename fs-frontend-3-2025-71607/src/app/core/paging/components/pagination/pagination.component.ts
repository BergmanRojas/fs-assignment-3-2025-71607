import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.pageIndex++;
    }
  }

  setPageIndex(page: number): void {
    this.pageIndex = page;
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  hasNext(): boolean {
    return (this.pageIndex) * this.pageSize < this.totalPages;
  }

  hasPrevious(): boolean {
    return this.pageIndex > 0;
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
    this.pageChange.emit(this.pageIndex);
  }
}
