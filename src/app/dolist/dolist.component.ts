import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dolist',
  templateUrl: './dolist.component.html',
  styleUrls: ['./dolist.component.scss'],
})
export class DolistComponent {
  dolistArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  title: string = '';
  status: string = 'Pending';
  Tid = '';

  constructor(private http: HttpClient) {
    this.getAllTask();
  }

  ngOnInit(): void {}

  editTask(task: any) {
    this.router.navigate(['/edit-task', task.id]); // Assuming you have an ID property for tasks
  }

  getAllTask() {
    this.http
      .get('http://localhost:8080/api/dolist/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.dolistArray = resultData.data;
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

  setUpdate(data: any) {
    this.title = data.title;
    this.status = data.status;
    this.Tid = data.id;
  }
}
