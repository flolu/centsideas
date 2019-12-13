import { injectable } from 'inversify';

import { EventRepositoryMock } from '@cents-ideas/event-sourcing';

import { Idea } from '../idea.entity';

@injectable()
export class IdeaRepositoryMock extends EventRepositoryMock<Idea> {
  constructor() {
    super();
    this.initialize(Idea, '', '', '');
  }
}
