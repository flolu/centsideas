import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { IdeasService } from './ideas.service';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'CENTS Ideas';

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });
  ideas$: Observable<any[]>;
  envFile$: Observable<string>;

  constructor(private service: IdeasService, private http: HttpClient) {
    this.ideas$ = this.service.fetchAll();
    // TODO try to fetch data from file in assets (api url)
    this.envFile$ = this.http.get('/assets/file.json').pipe((res: any) => res);
    /*console.log('try to fetch file from assets....');
     this.http
      .get('/assets/file.json')
      .pipe(
        tap((res: any) => {
          console.log('fetched file from assets: ', res);
          this.fileContent = res;
        }),
        catchError((err: any) => {
          console.log('error while fetching file from assets', err);
          return err;
        }),
      )
      .subscribe(); */
  }

  onCreate = () => {
    this.service.create(this.form.value);
  };
}
