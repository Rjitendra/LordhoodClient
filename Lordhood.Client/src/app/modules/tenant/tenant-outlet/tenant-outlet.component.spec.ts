/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TenantOutletComponent } from './tenant-outlet.component';

describe('TenantOutletComponent', () => {
  let component: TenantOutletComponent;
  let fixture: ComponentFixture<TenantOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
