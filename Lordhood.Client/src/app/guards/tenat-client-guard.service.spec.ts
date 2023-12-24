/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TenatClientGuardService } from './tenat-client-guard.service';

describe('Service: TenatClientGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenatClientGuardService]
    });
  });

  it('should ...', inject([TenatClientGuardService], (service: TenatClientGuardService) => {
    expect(service).toBeTruthy();
  }));
});
