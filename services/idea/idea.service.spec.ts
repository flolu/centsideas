import {UserId, IdeaId} from '@centsideas/types';
import {expectNoAsyncError} from '@centsideas/testing';
import {DependencyInjection} from '@centsideas/dependency-injection';
import {
  EventDispatcher,
  MONGO_EVENT_STORE_FACTORY,
  inMemoryEventStoreFactory,
  InMemoryEventStore,
  EventDispatcherMock,
} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {deserializeEvent} from '@centsideas/rpc';
import {MockConfig} from '@centsideas/config';

import {IdeaService} from './idea.service';
import {IdeaConfig} from './idea.config';

describe('IdeaService', () => {
  DependencyInjection.registerProviders(
    IdeaService,
    EventDispatcher,
    InMemoryEventStore,
    IdeaConfig,
  );
  DependencyInjection.overrideProvider(EventDispatcher, EventDispatcherMock);
  DependencyInjection.overrideProvider(IdeaConfig, MockConfig);
  DependencyInjection.registerFactory(MONGO_EVENT_STORE_FACTORY, inMemoryEventStoreFactory);

  const service: IdeaService = DependencyInjection.getProvider(IdeaService);
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

  it('store events and (de)serialize them', async () => {
    const newService: IdeaService = DependencyInjection.getProvider(IdeaService);
    const id = IdeaId.generate();

    await newService.create(id, userId);
    let events = await newService.getEvents(1);
    const createdEvent = events[0];
    expect(createdEvent.name).toEqual(IdeaEventNames.Created);
    expect(deserializeEvent(createdEvent).data).toMatchObject({id: id.toString(), userId});
    expect(createdEvent.sequence).toEqual(1);
    expect(createdEvent.version).toEqual(1);

    await newService.editDescription(id.toString(), userId, description);
    events = await newService.getEvents(2);
    const editedEvent = events[0];
    expect(editedEvent.name).toEqual(IdeaEventNames.DescriptionEdited);
    expect(deserializeEvent(editedEvent).data).toEqual({description});
    expect(editedEvent.sequence).toEqual(2);
    expect(editedEvent.version).toEqual(2);
  });
});
