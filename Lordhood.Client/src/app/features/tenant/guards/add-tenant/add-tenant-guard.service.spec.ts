/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddTenantGuardService } from './add-tenant-guard.service';

describe('Service: AddTenantGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddTenantGuardService]
    });
  });

  it('should ...', inject([AddTenantGuardService], (service: AddTenantGuardService) => {
    expect(service).toBeTruthy();
  }));
});
