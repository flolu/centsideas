import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { IdeasService } from './ideas.service';

describe('IdeasService', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});

describe('IdeasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IdeasService],
    });
  });

  it('should be created', () => {
    const service: IdeasService = TestBed.inject(IdeasService);
    expect(service).toBeTruthy();
  });
});
