/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RentReportComponent } from './rent-report.component';

describe('RentReportComponent', () => {
  let component: RentReportComponent;
  let fixture: ComponentFixture<RentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [RentReportComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
