import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dolist',
  templateUrl: './dolist.component.html',
  styleUrls: ['./dolist.component.scss'],
})
export class DolistComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dolistArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  title: string = '';
  status: string = 'Pending';
  Tid = '';

  sortColumn: string = 'title';
  sortDirection: string = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 5; // Set the number of items per page
  totalItems: number = 0;

  constructor(private http: HttpClient, private router: Router) {
    this.getAllTask();
  }

  ngOnInit(): void {
    this.currentPage = 1;
    this.getAllTask();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllTask();
    }
  }

  // Function to sort data based on current sortColumn and sortDirection
  sortData(): void {
    this.dolistArray.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // getAllTask() {
  //   this.http
  //     .get('http://localhost:8080/api/dolist/')
  //     .subscribe((resultData: any) => {
  //       this.isResultLoaded = true;
  //       console.log(resultData.data);
  //       this.dolistArray = resultData.data;
  //     });
  // }

  getAllTask() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.http
      .get('http://localhost:8080/api/dolist/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.dolistArray = resultData.data.slice(startIndex, endIndex);
        this.totalItems = resultData.data.length;
      });
  }

  save() {
    if (this.Tid == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }

  register() {
    let bodyData = {
      title: this.title,
      status: this.status,
    };
    this.http
      .post('http://localhost:8080/api/dolist/add', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Task created Successfully');
        this.getAllTask();
      });
  }

  UpdateRecords() {
    let bodyData = {
      title: this.title,
      status: this.status,
    };

    this.http
      .put('http://localhost:8080/api/dolist/update' + '/' + this.Tid, bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Task Registered Updated');
        this.getAllTask();
      });
  }

  setDelete(data: any) {
    this.http
      .delete('http://localhost:8080/api/dolist/delete' + '/' + data.id)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('task Deleted');
        this.getAllTask();
      });
  }
  // editTask(task: any) {
  //   this.router.navigate(['/edit-task', task.id], { state: { task } });
  // }
  editTask(task: any) {
    this.router.navigate(['/edit-task', task.id]);
  }
  // editTask(task: any) {
  //   this.router.navigate(['/edit-task', task.id]);
  // }
}
