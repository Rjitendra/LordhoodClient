/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OngoingTenancyComponent } from './ongoing-tenancy.component';

describe('OngoingTenancyComponent', () => {
  let component: OngoingTenancyComponent;
  let fixture: ComponentFixture<OngoingTenancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [OngoingTenancyComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTenancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
