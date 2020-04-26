import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IIdeaForm } from './store';

@Component({
  selector: 'cic-ideas-create',
  template: `
    <h1>Create an Idea</h1>
    <form [formGroup]="form">
      <label for="title">
        Title
      </label>
      <br />
      <input id="title" type="text" formControlName="title" />
      <br />
      <label for="description">
        Description
      </label>
      <br />
      <input id="description" type="text" formControlName="description" />
      <br />
      <button (click)="onCreate()">Create</button>
    </form>
    <p>{{ status }}</p>
  `,
})
export class CreateIdeaComponent {
  @Input() status: number;
  @Input() formState: IIdeaForm;
  @Output() create = new EventEmitter<IIdeaForm>();

  form: FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
  });

  onCreate() {
    this.create.emit(this.form.value);
  }
}
