import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { IdeasService } from './ideas.service';
import { SettingsService, SettingsMockService } from '@ci-frontend/app';

describe('IdeasService', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});

describe('IdeasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IdeasService, SettingsService],
    });
    TestBed.overrideProvider(SettingsService, {
      useValue: new SettingsMockService(),
    });
  });

  it('should be created', () => {
    const service: IdeasService = TestBed.get(IdeasService);
    expect(service).toBeTruthy();
  });
});
