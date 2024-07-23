import { TestBed } from '@angular/core/testing';

import { TokenPersistenceService } from './token-persistence.service';

describe('TokenPersistenceService', () => {
  let service: TokenPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
