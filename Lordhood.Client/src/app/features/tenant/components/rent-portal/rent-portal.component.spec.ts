/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RentPortalComponent } from './rent-portal.component';

describe('RentPortalComponent', () => {
  let component: RentPortalComponent;
  let fixture: ComponentFixture<RentPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [RentPortalComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
