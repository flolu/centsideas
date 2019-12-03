import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { AppState } from '@ci-frontend/app';

import { ReviewsActions } from '..';
import { IReviewViewModel } from '@cents-ideas/models';

@Component({
  selector: 'ci-reviews',
  template: `
    <h3>Reviews</h3>
    <form [formGroup]="form">
      <label>
        Rate this idea
        <input type="text" formControlName="content" />
      </label>
      <br />
      <label>
        🎚 Control
        <select formControlName="control">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        🚪 Entry
        <select formControlName="entry">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        🙏 Need
        <select formControlName="need">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        ⏰ Time
        <select formControlName="time">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <label>
        🐘 Scale
        <select formControlName="scale">
          <option *ngFor="let state of states" [ngValue]="state">
            {{ state }}
          </option>
        </select>
      </label>
      <br />
      <button (click)="onSubmit()">Submit</button>
    </form>
    <span>Reviews: </span>
    <ci-review *ngFor="let r of reviews" [review]="r"></ci-review>
  `,
})
export class ReviewsContainer {
  @Input() reviews: IReviewViewModel[];

  form = new FormGroup({
    content: new FormControl(''),
    control: new FormControl(1),
    entry: new FormControl(1),
    need: new FormControl(1),
    time: new FormControl(1),
    scale: new FormControl(1),
  });
  states = [0, 1, 2, 3, 4, 5];

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  onSubmit = () => {
    this.store.dispatch(
      ReviewsActions.createReview({
        ideaId: this.route.snapshot.params.id,
        content: this.form.value.content,
        scores: {
          control: this.form.value.control,
          entry: this.form.value.entry,
          need: this.form.value.need,
          time: this.form.value.time,
          scale: this.form.value.scale,
        },
      }),
    );
  };
}
