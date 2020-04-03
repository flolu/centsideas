import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UsersService } from './users.service';

describe('UsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UsersService],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(UsersService);
    expect(service).toBeTruthy();
  });
});
