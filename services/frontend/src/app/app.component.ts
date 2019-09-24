import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'CENTS Ideas';

  private alive = true;
  private readonly url = 'http://localhost:3000';

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });
  ideas$: Observable<any[]>;

  /* constructor(private http: HttpClient) {
    this.fetchIdeas();
  } */

  ngOnDestroy = () => (this.alive = false);

  /* onCreate = () => {
    this.http.post(`${this.url}/ideas`, {}).subscribe((response: any) => {
      const id = response.created.id;
      this.http.put(`${this.url}/ideas/${id}`, this.form.value).subscribe((response: any) => {
        this.http.put(`${this.url}/ideas/publish/${id}`, {}).subscribe(() => {
          this.fetchIdeas();
        });
      });
    });
  };

  private fetchIdeas = () =>
    (this.ideas$ = this.http
      .get(`${this.url}/ideas`)
      .pipe(map(response => (response as any).found.filter(idea => !idea.deleted && idea.published)))); */
}
