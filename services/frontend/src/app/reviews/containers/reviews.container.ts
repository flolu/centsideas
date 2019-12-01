import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ci-reviews',
  template: `
    <h3>Reviews</h3>
    <form [formGroup]="form">
      <label>
        Rate this idea
        <input type="text" formControlName="description" />
      </label>
      <br />
      <label>
        Control
        <select formControlName="control">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        Entry
        <select formControlName="entry">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        Need
        <select formControlName="need">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        Time
        <select formControlName="time">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        Scale
        <select formControlName="scale">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <button (click)="onSubmit()">Submit</button>
    </form>
  `,
})
export class ReviewsContainer {
  form = new FormGroup({
    description: new FormControl(''),
    control: new FormControl(1),
    entry: new FormControl(1),
    need: new FormControl(1),
    time: new FormControl(1),
    scale: new FormControl(1),
  });
  states = [1, 2, 3, 4, 5];

  onSubmit = () => {
    console.log('submit review', this.form.value);
  };
}
