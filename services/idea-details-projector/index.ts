// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import {DependencyInjection} from '@centsideas/dependency-injection';
import {GlobalEnvironment} from '@centsideas/environment';
import {EventListener} from '@centsideas/event-sourcing2';
import {Logger, UTILS_TYPES} from '@centsideas/utils';
import {Services} from '@centsideas/enums';

import {IdeaDetailsProjector} from './idea-details.projector';

DependencyInjection.registerProviders(
  GlobalEnvironment,
  EventListener,
  IdeaDetailsProjector,
  Logger,
);

DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.IdeaDetailsProjector);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [60, 100, 80]);
DependencyInjection.bootstrap(IdeaDetailsProjector);
