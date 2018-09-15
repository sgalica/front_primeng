import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {NewCollaborateurComponent } from './newCollaborateur.component';

describe('newCollaborateurComponent', () => {
    let component: NewCollaborateurComponent;
    let fixture: ComponentFixture<NewCollaborateurComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NewCollaborateurComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewCollaborateurComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
