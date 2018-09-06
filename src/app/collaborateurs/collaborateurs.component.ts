import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../demo/service/collaborateur.service';
import {Collaborateur} from '../demo/service/collaborateur';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {


    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];

    constructor( private collaborateurService: CollaborateurService) { }

    ngOnInit() {

        this.sortOptions = [
            {label: 'Newest First', value: '!nom'},
            {label: 'Oldest First', value: 'prenom'},
            {label: 'Brand', value: 'brand'}
        ];


            this.loadAllCollaborateurs();
    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {
        this.selectedCollaborateur = collaborateur;
        this.displayDialog = true;
        event.preventDefault();
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onDialogHide() {
        this.selectedCollaborateur = null;
    }

    loadAllCollaborateurs() {
        this.collaborateurService.getAll().pipe(first()).subscribe(collaborateurs => {
            this.collaborateurs = collaborateurs;
        });
    }
}
