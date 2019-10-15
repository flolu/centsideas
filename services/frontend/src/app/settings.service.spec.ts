import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { HttpClientModule } from '@angular/common/http';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientModule], providers: [SettingsService] }));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
