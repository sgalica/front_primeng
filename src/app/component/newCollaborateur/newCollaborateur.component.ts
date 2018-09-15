import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';

@Component({
    selector: 'app-newCollaborateur',
    templateUrl: './newCollaborateur.component.html',
    styleUrls: ['./newCollaborateur.component.css']
})
export class NewCollaborateurComponent implements OnInit {


    collaborateur : Collaborateur;

    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols: any[];

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
        this.cols = [

            {header: 'id_pilot', field:'id_pilot'},
            {header: 'nom', field:'nom'},
            {header: 'prenom', field:'prenom'},
            {header: 'trig_open', field:'trig_open'},
            {header: 'tel_perso', field:'tel_perso'},
            {header: 'tel_pro', field:'tel_pro'},
            {header: 'mail_open', field:'mail_open'},
            {header: 'mail_sg', field:'mail_sg'},
            {header: 'categorisation', field:'code_categorisation'},
            {header: 'top_statut', field:'top_statut'},
            {header: 'statut', field:'statut'},

        ]

        this.loadAllCollaborateurs();
        this.saveNewCollaborateur(this.collaborateur);
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

    saveNewCollaborateur(collaborateur : Collaborateur) {

        this.collaborateurService.update(collaborateur);


    }

}