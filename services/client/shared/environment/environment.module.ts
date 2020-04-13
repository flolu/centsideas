import { NgModule } from '@angular/core';
import { EnvironmentService } from './environment.service';

@NgModule({ providers: [EnvironmentService] })
export class EnvironmentModule {
  constructor(private environmentService: EnvironmentService) {
    this.environmentService.handleStateTransfer();
  }
}
