import {UserId, IdeaId} from '@centsideas/types';
import {expectNoAsyncError} from '@centsideas/testing';
import {DI} from '@centsideas/dependency-injection';
import {
  EventDispatcher,
  MONGO_EVENT_STORE_FACTORY,
  inMemoryEventStoreFactory,
  InMemoryEventStore,
  EventDispatcherMock,
  MONGO_SNAPSHOT_STORE_FACTORY,
  inMemorySnapshotStoreFactory,
  InMemorySnapshotStore,
} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {deserializeEvent, RPC_CLIENT_FACTORY, rpcClientFactory, RpcClient} from '@centsideas/rpc';
import {MockConfig} from '@centsideas/config';
import {RpcClientMock} from '@centsideas/rpc/testing';

import {IdeaService} from './idea.service';
import {IdeaConfig} from './idea.config';
import {IdeaReadAdapter} from './idea-read.adapter';

describe('IdeaService', () => {
  DI.registerProviders(
    IdeaService,
    IdeaConfig,
    EventDispatcher,
    InMemoryEventStore,
    InMemorySnapshotStore,
    IdeaReadAdapter,
    RpcClient,
  );
  DI.overrideProvider(EventDispatcher, EventDispatcherMock);
  DI.overrideProvider(RpcClient, RpcClientMock);
  DI.overrideProvider(IdeaConfig, MockConfig);
  DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);
  DI.registerFactory(MONGO_EVENT_STORE_FACTORY, inMemoryEventStoreFactory);
  DI.registerFactory(MONGO_SNAPSHOT_STORE_FACTORY, inMemorySnapshotStoreFactory);

  const service: IdeaService = DI.getProvider(IdeaService);
  const userId = UserId.generate().toString();
  const title = 'My awesome title';
  const description = 'This is idea is meant to be great, but also a dummy mock test description!';
  const description2 = 'This is idea is meant to be great, but also a dummy test description!';
  const tags = ['mock', 'test', 'idea', 'awesome'];
  const tags2 = ['test', 'idea', 'nice', 'awesome'];

  it('creates an idea', async () => {
    const id = IdeaId.generate();
    await expectNoAsyncError(() => service.create(id, userId));
  });

  // FIXME probably only possible via integration test
  /* it('does not create a new idea if the user still has an unpublished idea', async () => {
    const id = IdeaId.generate();
    await expectNoAsyncError(() => service.create(id, userId));
    const upsertedId = await service.create(id, userId);
    expect(upsertedId).toEqual(id.toString());
  }); */

  it('renames an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.rename(id.toString(), userId, title));
  });

  it('edits an idea description', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.editDescription(id.toString(), userId, description));
  });

  it('updates idea tags', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.updateTags(id.toString(), userId, tags));
  });

  it('publishs an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await service.rename(id.toString(), userId, title);
    await expectNoAsyncError(() => service.publish(id.toString(), userId));
  });

  it('deletes an idea', async () => {
    const id = IdeaId.generate();
    await service.create(id, userId);
    await expectNoAsyncError(() => service.delete(id.toString(), userId));
  });

  it('goes through the whole idea lifecycle', async () => {
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

  it('stores events and (de)serialize them', async () => {
    const newService: IdeaService = DI.getProvider(IdeaService);
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
