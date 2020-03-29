import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ci-idea',
  template: `idea page of {{ ideaId }}`,
})
export class IdeaContainer {
  ideaId: string = this.route.snapshot.params.id;

  constructor(private route: ActivatedRoute) {}
}
