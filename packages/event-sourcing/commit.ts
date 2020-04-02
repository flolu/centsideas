import { IEventCommitFunctions } from '.';

export const composeCommitFunctions = <T>(events: any): IEventCommitFunctions<T> => {
  const commitFunctions: IEventCommitFunctions<T> = {};
  Object.keys(events).forEach(key => {
    const event = events[key];
    commitFunctions[event.eventName] = event.commit;
  });
  return commitFunctions;
};
