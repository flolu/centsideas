import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { IdeasService } from './ideas.service';

// TODO prettier with angular

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

  /* constructor(private service: IdeasService) {
    this.ideas$ = this.service.fetchAll();
  }

  onCreate = () => {
    this.service.create(this.form.value);
  }; */
}
