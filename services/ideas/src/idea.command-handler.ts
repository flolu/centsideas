import { IdeaRepository } from './idea.repository';
import { Idea } from './idea.entity';

// TODO validation
export class IdeaCommandHandler {
  constructor(private readonly repository: IdeaRepository) {}

  async create(): Promise<Idea> {
    const ideaId: string = 'random-id-' + Date.now().toString();
    const idea = Idea.create(ideaId);
    return this.repository.save(idea);
  }

  async saveDraft(ideaId: string, title?: string, description?: string): Promise<Idea> {
    const idea = await this.repository.findById(ideaId);
    idea.saveDraft(title, description);
    return this.repository.save(idea);
  }

  async publish(ideaId: string) {
    const idea = await this.repository.findById(ideaId);
    idea.publish();
    return this.repository.save(idea);
  }

  async update(ideaId: string, title?: string, description?: string) {
    const idea = await this.repository.findById(ideaId);
    idea.update(title, description);
    return this.repository.save(idea);
  }

  async unpublish(ideaId: string) {
    const idea = await this.repository.findById(ideaId);
    idea.unpublish();
    return this.repository.save(idea);
  }

  async delete(ideaId: string) {
    const idea = await this.repository.findById(ideaId);
    idea.delete();
    return this.repository.save(idea);
  }
}
