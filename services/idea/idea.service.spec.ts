import {UserId, IdeaId} from '@centsideas/types';
import {expectNoAsyncError} from '@centsideas/testing';

import {IdeaService} from './idea.service';

// TODO this tesing to expect not to throw errors seems useless?!
describe('IdeaService', () => {
  const service = new IdeaService();
  const userId = UserId.generate().toString();
  const title = 'My awesome title';
  const description = 'This is idea is meant to be great, but also a dummy mock test description!';
  const description2 = 'This is idea is meant to be great, but also a dummy test description!';
  const tags = ['mock', 'test', 'idea', 'awesome'];
  const tags2 = ['test', 'idea', 'nice', 'awesome'];

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

  it('should go through the whole idea lifecycle', async () => {
    const id = IdeaId.generate();
    await expectNoAsyncError(async () => {
      await service.create(id, userId);
      await service.rename(id.toString(), userId, 'first title');
      await service.rename(id.toString(), userId, title);
      await service.editDescription(id.toString(), userId, description);
      await service.updateTags(id.toString(), userId, tags);
      await service.updateTags(id.toString(), userId, tags2);
      await service.publish(id.toString(), userId);
      await service.editDescription(id.toString(), userId, description2);
      await service.delete(id.toString(), userId);
    });
  });
});
