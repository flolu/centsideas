import { Component, Input, Output, EventEmitter } from '@angular/core';

import { IIdeaViewModel } from '@cents-ideas/models';

@Component({
  selector: 'ci-ideas-card',
  template: `
    <div class="card">
      <div class="score">{{ score }}</div>
      <div class="preview">
        <span class="title" (click)="onTitleClick()">{{ idea?.title }}</span>
        <div class="tags">
          <span>some</span>
          <span>test</span>
          <span>tags</span>
        </div>
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
      }

      .score {
        font-size: 2.5em;
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
        background: lightblue;
        margin-right: 5px;
        padding: 2px 5px;
        color: darkblue;
      }
    `,
  ],
})
export class IdeaCardComponent {
  @Input() idea: IIdeaViewModel;

  @Output() clickedTitle = new EventEmitter<void>();

  score = Math.floor(Math.random() * 100);

  onTitleClick = () => this.clickedTitle.emit();
}
