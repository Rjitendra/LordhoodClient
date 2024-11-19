/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IssueReportComponent } from './issue-report.component';

describe('IssueReportComponent', () => {
  let component: IssueReportComponent;
  let fixture: ComponentFixture<IssueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IssueReportComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
