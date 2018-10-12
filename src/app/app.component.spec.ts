/* tslint:disable:no-unused-variable */

import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';

import {ScrollPanelModule} from 'primeng/primeng';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule, ScrollPanelModule ],
        declarations: [ AppComponent

            ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
