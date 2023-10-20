import { KeyValue } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponentComponent<T> {

  @Output() selectionChange = new EventEmitter<any[]>();
  @Input() data: T[] | Promise<T[]> = [];
  @Input() tableHeaders: string[] = [];
  @Input() rowSelection: boolean = false;
  @Input() pageSize: number = 10;
  @Input() translatePaginatedData: (data: T[], currentPage: number, pageSize: number) => T[] = data => data;
  @Output() selectedRowsChange: EventEmitter<T[]> = new EventEmitter<T[]>();
  public currentPage: number = 1;
  public totalPages: number = 1;

  public tableData: unknown[] = [];
  public paginatedData: any[] = [];
  public selectedRows: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes || 'pageSize' in changes || 'currentPage' in changes) {
      this.processData();
    }
  }

  async processData(): Promise<void> {
    if (this.data instanceof Promise) {
      this.tableData = await this.data;
    } else {
      this.tableData = this.data;
    }
    this.totalPages = Math.ceil(this.tableData.length / this.pageSize);
    this.updateTableData();
  }

  updateTableData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, endIndex);
    const missingRows = this.pageSize - this.paginatedData.length;
    if (missingRows > 0) {
      for (let i = 0; i < missingRows; i++) {
        this.paginatedData.push({} as T);
      }
    }
  }

  changePage(offset: number): void {
    const newPage = this.currentPage + offset;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updateTableData();
    }
  }

  isNextButtonDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }

  isPrevButtonDisabled(): boolean {
    return this.currentPage <= 1;
  }

  toggleSelection(row: T): void {
    if (this.selectedRows.includes(row)) {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
    } else {
      this.selectedRows.push(row);
    }
    this.selectedRowsChange.emit(this.selectedRows);
  }
  toggleAllSelection(): void {
    if (this.selectedRows.length === this.tableData.length) {
      this.selectedRows = [];
    } else {
      this.selectedRows = this.tableData.filter(row => !this.selectedRows.includes(row));
    }
    this.selectedRowsChange.emit(this.selectedRows);
  }

  // Keep the original columns order
  public columnsOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
}
