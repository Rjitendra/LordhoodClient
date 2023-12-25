/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspectionHistoryComponent } from './issue-history.component';

describe('InspectionHistoryComponent', () => {
  let component: InspectionHistoryComponent;
  let fixture: ComponentFixture<InspectionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [InspectionHistoryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
