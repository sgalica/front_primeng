import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {PrestationService} from '../../service/prestation.service';
import {Prestation} from '../../model/prestation';
import {ActivatedRoute, Params } from '@angular/router';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';



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

    employee_name= "";

    employee : Collaborateur;

    constructor( private prestationService: PrestationService, private employeeService : CollaborateurService, private route: ActivatedRoute) { }

    ngOnInit() {

        this.sortOptions = [
            {label: 'Newest First', value: '!nom'},
            {label: 'Oldest First', value: 'prenom'},
            {label: 'Brand', value: 'brand'}
        ];
        this.cols = [

/*            {header: 'Id', field:'id_prestation'},*/
            {header: 'Début', field:'date_debut_prest'},
            {header: 'Fin', field:'date_fin_prest'},
            {header: 'ATG', field:'no_atg'},
/*            {header: 'ATG', field:'top_atg_atu'},*/
            {header: 'Département', field:'departement'},
            {header: 'Pôle', field:'pole'},
            {header: 'Domaine', field:'domaine'},
            {header: 'Site', field:'site'},
            {header: 'PU', field:'pu'},
/*
            {header: 'no_cont', field:'no_contrat'},
            {header: 'id_pil', field:'id_pilot'},
            {header: 'resp_p', field:'id_resp_pole'},
            {header: 'd_ordre', field:'id_don_ordre'},
            {header: 'etat', field:'etat_prest'},
            {header: 'site_sg', field:'site_sg'},
            {header: 'com_open', field:'id_commercial_open'},

            {header: 'date_c', field:'date_creation'},
            {header: 'user_c', field:'id_utilisateur_creation'},
            {header: 'date_m', field:'date_maj'},
            {header: 'user_m', field:'utilisateur_maj'},
*/
        ];

        let id = this.route.snapshot.params['idcollab'];
        if (id==undefined || id=="" )
            this.loadAllPrestations();
        else
            this.loadPrestationsCollab(id);
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
        /* DUMMY !!! : */
        prestation : Prestation;
         let prestation = {
             id_prestation:1, no_contrat:"no_contrat", id_pilot:"id_pilot", departement:"departement", pole:"pole", domaine:"domaine",
             code_site:"code_site", no_atg:"no_atg", id_resp_pole:"id_resp_pole", id_don_ordre:"id_don_ordre",
            pu:"pu",
            date_debut_prest:"date_debut_prest",
            date_fin_prest:"date_fin_prest",
            etat_prest:"etat_prest",
            site_sg:"site_sg",
            id_commercial_open:"id_commercial_open",
            top_atg_atu:"top_atg_atu",
            date_creation:"date_creation",
            id_utilisateur_creation:"id_utilisateur_creation",
            date_maj:"date_maj",
            utilisateur_maj:"utilisateur_maj",
        }
        this.prestations = [prestation];


        this.prestationService.getAll().pipe(first()).subscribe(prestations => {
            this.prestations = prestations;
        });
    }


    loadPrestationsCollab(idemployee : number) {
        /*DUMMY : !!! */
        this.employee_name="ME";
        console.log("EMPLOYEE", this.employee_name );
        this.loadAllPrestations();

        this.employeeService.getById(idemployee).pipe(first()).subscribe(employee => {
            //this.employee_name = employee.prenom + " " + employee.nom;
        });
        //this.prestationService.getAll().pipe(first()).subscribe(prestations => {
        //    this.prestations = prestations;
        //});
    }
}
