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
    <h1>Post a Review</h1>
    <form [formGroup]="form">
      <label for="content">
        Rate this idea
      </label>
      <br />
      <textarea name="content" type="text" formControlName="content"></textarea>
      <br />
      <div class="scores">
        <div>
          <label>
            🎚 Control
          </label>
          <br />
          <input class="number" formControlName="control" min="0" max="5" step="1" type="number" />
        </div>
        <div>
          <label>
            🚪 Entry
          </label>
          <br />
          <input class="number" formControlName="entry" min="0" max="5" step="1" type="number" />
        </div>
        <div>
          <label>
            🙏 Need
          </label>
          <br />
          <input class="number" formControlName="need" min="0" max="5" step="1" type="number" />
        </div>
        <div>
          <label>
            ⏰ Time
          </label>
          <br />
          <input class="number" formControlName="time" min="0" max="5" step="1" type="number" />
        </div>
        <div>
          <label>
            🐘 Scale
          </label>
          <br />
          <input class="number" formControlName="scale" min="0" max="5" step="1" type="number" />
        </div>
      </div>
      <br />
      <button (click)="onSubmit()">Submit</button>
    </form>
    <h1>Reviews</h1>
    <ci-review *ngFor="let r of reviews" [review]="r"></ci-review>
  `,
  styles: [
    `
      textarea {
        max-width: 500px;
        width: 100%;
        resize: vertical;
        max-height: 500px;
      }
      input.number {
        max-width: 50px;
      }
      .scores {
        display: flex;
        flex-direction: row;
        max-width: 500px;
      }
      .scores > div {
        flex: 1;
      }
    `,
  ],
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
