/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddAdditionalDetailComponent } from './add-additional-detail.component';

describe('AddAdditionalDetailComponent', () => {
  let component: AddAdditionalDetailComponent;
  let fixture: ComponentFixture<AddAdditionalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [AddAdditionalDetailComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
