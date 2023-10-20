import { User } from './models/app.model';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public data: User[] = [];

  public customHeaders: string[] = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Age',
  ];
  public pageSize: number = 10;
  public isSelectable: boolean = true; // Controls the selecting possibility
  private selectedRows: User[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const url = "/assets/data/table-data.json";
    this.http.get<User[]>(url).subscribe((response) => {
      this.data = response;
    })
  }

  translatePaginatedData(data: User[], currentPage: number, pageSize: number): User[] {
    // Implement here the meta-data translation coming from the server to implement pagination properly
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    return paginatedData;
  }

  handleSelectedRowsChange(selectedRows: User[]): void {
    this.selectedRows = selectedRows;
    console.log("Selected Rows: ", this.selectedRows);

  }
}
