import { IEventCommitFunctions } from '.';

export const composeCommitFunctions = <T>(events: any): IEventCommitFunctions<T> => {
  const commitFunctions: IEventCommitFunctions<T> = {};
  Object.keys(events).forEach(key => {
    const event = events[key];
    if (event.eventName in commitFunctions)
      throw new Error(`Found multiple events with name: ${event.eventName}`);
    commitFunctions[event.eventName] = event.commit;
  });
  return commitFunctions;
};
