import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  // styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  taskId: string = '0';
  task: any = {}; // Initialize as an empty object or with default values

  title: string = '';
  status: string = '';

  selectStatus(status: string) {
    this.task.status = status;
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id')!;
      this.loadTask();
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  loadTask(): void {
    const apiUrl = `http://localhost:8080/api/dolist/${this.taskId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.task = response.data[0];
        }
        console.log('Fetching task:', this.task);
      },
      (error) => {
        console.error('Error fetching task:', error);
      }
    );
  }

  updateTask(): void {
    const apiUrl = `http://localhost:8080/api/task/update/${this.taskId}`; // Make sure the API URL is correct
    const updateData = {
      title: this.task.title,
      status: this.task.status,
    };

    this.http.put<any>(apiUrl, updateData).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        alert('Task Update Successfully');
        // Refresh the page by navigating to the current route
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
        window.location.reload();
        // this.router.navigate(['/']);
        // You can add a success message or redirect back to the list page here
      },
      (error) => {
        console.error('Error updating task:', error);
        // Handle the error, show an error message, etc.
      }
    );
  }
}
