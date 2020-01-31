import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';

import { IIdeaViewModel } from '@cents-ideas/models';

@Component({
  selector: 'ci-ideas-card',
  template: `
    <div class="card">
      <div class="score" [style.opacity]="opacity" [style.color]="color">
        {{ score | number: '1.0-0' }}
      </div>
      <div class="preview">
        <span class="title" (click)="onTitleClick()">{{ idea?.title }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        background: var(--light-grey);
        border: 1.5px solid var(--grey);
        border-radius: var(--border-radius);
        margin: 10px 0;
      }

      .score {
        font-size: 2.5em;
        font-weight: bold;
        margin-right: 20px;
      }

      .preview {
        display: flex;
        flex-direction: column;
      }

      .title {
        font-size: 1.5em;
        cursor: pointer;
      }

      .tags > span {
        background: var(--secondary);
        margin-right: 5px;
        padding: 2px 5px;
        color: var(--secondary-dark);
        border-radius: var(--border-radius);
      }
    `,
  ],
})
export class IdeaCardComponent implements OnInit {
  @Input() idea: IIdeaViewModel;

  @Output() clickedTitle = new EventEmitter<void>();

  opacity: number;
  color: string;
  score: number;

  ngOnInit() {
    this.opacity = 0.05 * this.idea.reviewCount + 0.5;

    this.score = this.idea.scores
      ? (this.idea.scores.control +
          this.idea.scores.entry +
          this.idea.scores.need +
          this.idea.scores.time +
          this.idea.scores.scale) *
        4
      : 0;

    const strength = (1 / 30) * this.score - 5 / 3;
    this.color = `rgb(${255 * strength}, ${100 * strength}, ${0})`;
  }

  onTitleClick = () => this.clickedTitle.emit();
}
