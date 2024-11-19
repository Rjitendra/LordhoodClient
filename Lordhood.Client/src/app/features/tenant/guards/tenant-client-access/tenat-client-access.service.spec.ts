/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TenatClientAccessService } from '../../../../guards/tenat-client-access.service';

describe('Service: TenatClientAccess', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenatClientAccessService]
    });
  });

  it('should ...', inject([TenatClientAccessService], (service: TenatClientAccessService) => {
    expect(service).toBeTruthy();
  }));
});
