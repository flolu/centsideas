import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { SettingsService } from '@ci-frontend/app';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientModule], providers: [SettingsService] }));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
