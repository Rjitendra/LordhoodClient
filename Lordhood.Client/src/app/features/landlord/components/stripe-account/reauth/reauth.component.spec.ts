/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReauthComponent } from './reauth.component';

describe('ReauthComponent', () => {
  let component: ReauthComponent;
  let fixture: ComponentFixture<ReauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ReauthComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
