import {UserId, IdeaId} from '@centsideas/types';
import {expectNoAsyncError} from '@centsideas/testing';

import {IdeaService} from './idea.service';

describe('IdeaService', () => {
  const service = new IdeaService();
  const userId = UserId.generate().toString();
  const title = 'My awesome title';
  const description = 'This is idea is meant to be great, but also a dummy mock test description!';
  const tags = ['mock', 'test', 'idea', 'awesome'];

  it('should create an idea', async () => {
    const id = IdeaId.generate();
    await expectNoAsyncError(() => service.create(id, userId));
  });

  it('should rename an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.rename(id.toString(), userId, title));
  });

  it('should edit an idea description', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.editDescription(id.toString(), userId, description));
  });

  it('should update idea tags', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.updateTags(id.toString(), userId, tags));
  });

  it('should publish an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await service.rename(id.toString(), userId, title);
    await expectNoAsyncError(() => service.publish(id.toString(), userId));
  });

  it('should delete an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.delete(id.toString(), userId));
  });
});
