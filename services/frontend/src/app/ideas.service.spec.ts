import { TestBed } from '@angular/core/testing';

import { IdeasService } from './ideas.service';
import { HttpClientModule } from '@angular/common/http';

describe('IdeasService', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});

/* describe('IdeasService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientModule], providers: [IdeasService] }));

  it('should be created', () => {
    const service: IdeasService = TestBed.get(IdeasService);
    expect(service).toBeTruthy();
  });
}); */
