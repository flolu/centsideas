import { Component, Input } from '@angular/core';
import { IReviewViewModel } from '@cents-ideas/models';

@Component({
  selector: 'ci-review',
  template: `
    <div class="review">
      <span
        ><strong>{{ review.content }}</strong></span
      >
      <br />
      <div class="scores">
        <span class="score"
          >🎚 Control: <span class="number">{{ review.scores?.control }}</span></span
        >
        <span class="score"
          >🚪 Entry: <span class="number">{{ review.scores?.entry }}</span></span
        >
        <span class="score"
          >🙏 Need: <span class="number">{{ review.scores?.need }}</span></span
        >
        <span class="score"
          >⏰ Time: <span class="number">{{ review.scores?.time }}</span></span
        >
        <span class="score"
          >🐘 Scale: <span class="number">{{ review.scores?.scale }}</span></span
        >
      </div>
      <p class="published">published: {{ review.publishedAt | date }}</p>
    </div>
  `,
  styles: [
    `
      .review {
        border: 1px solid rgb(200, 200, 200);
        border-radius: 5px;
        padding: 10px;
        margin: 10px 5px;
      }
      .published {
        color: grey;
      }
      .scores {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
      .score {
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .score > .number {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0 5px;
      }
    `,
  ],
})
export class ReviewComponent {
  @Input() review: IReviewViewModel;
}
