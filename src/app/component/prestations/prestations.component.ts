import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {PrestationService} from '../demo/service/prestation.service';
import {Prestation} from '../demo/service/prestation';


@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: ['./prestations.component.css']
})
export class PrestationsComponent implements OnInit {


    selectedPrestation: Prestation;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols :any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    prestations: Prestation[] = [];

    constructor( private prestationService: PrestationService) { }

    ngOnInit() {

        this.sortOptions = [
            {label: 'Newest First', value: '!nom'},
            {label: 'Oldest First', value: 'prenom'},
            {label: 'Brand', value: 'brand'}
        ];
        this.cols = [

            {header: 'id_pres', field:'id_prestation'},
            {header: 'no_cont', field:'no_contrat'},
            {header: 'id_pil', field:'id_pilot'},
            {header: 'dep', field:'departement'},
            {header: 'pole', field:'pole'},
            {header: 'dom', field:'domaine'},
            {header: 'site', field:'site'},
            {header: 'atg', field:'no_atg'},
            {header: 'resp_p', field:'id_resp_pole'},
            {header: 'd_ordre', field:'id_don_ordre'},
            {header: 'pu', field:'pu'},
            {header: 'dateDprest', field:'date_debut_prest'},
            {header: 'dateFprest', field:'date_fin_prest'},
            {header: 'etat_p', field:'etat_prest'},
            {header: 'site_sg', field:'site_sg'},
            {header: 'com_open', field:'id_commercial_open'},
            {header: 'atg_atu', field:'top_atg_atu'},
            {header: 'date_c', field:'date_creation'},
            {header: 'user_crea', field:'id_utilisateur_creation'},
            {header: 'date_maj', field:'date_maj'},
            {header: 'user_maj', field:'utilisateur_maj'},

        ];


        this.loadAllPrestations();
    }

    selectPrestation(event: Event, prestation: Prestation) {
        this.selectedPrestation = prestation;
        this.displayDialog = true;
        event.preventDefault();
    }

    onSortChange(event) {
        const field = event.field;

        if (field.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = field.substring(1, field.length);
        } else {
            this.sortOrder = 1;
            this.sortField = field;
        }
    }

    onDialogHide() {
        this.selectedPrestation = null;
    }

    loadAllPrestations() {
        this.prestationService.getAll().pipe(first()).subscribe(prestations => {
            this.prestations = prestations;
        });
    }
}
