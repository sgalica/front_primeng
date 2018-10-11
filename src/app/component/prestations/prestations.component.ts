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
            {header: 'Début', field:'dateDebutPrest'},
            {header: 'Fin', field:'dateFinPrest'},
            {header: 'ATG', field:'noAtg'},
/*            {header: 'ATG', field:'top_atg_atu'},*/
            {header: 'Département', field:'departement'},
            {header: 'Pôle', field:'pole'},
            {header: 'Domaine', field:'domaine'},
            {header: 'Site', field:'site'},
            {header: 'PU', field:'pu'},
/*
            {header: 'no_cont', field:'noContrat'},
            {header: 'id_pil', field:'idPilot'},
            {header: 'resp_p', field:'idRespPole'},
            {header: 'd_ordre', field:'idDonOrdre'},
            {header: 'etat', field:'etatPrest'},
            {header: 'site_sg', field:'siteSg'},
            {header: 'com_open', field:'idCommercialOpen'},

            {header: 'date_c', field:'dateCreation'},
            {header: 'user_c', field:'idUtilisateurCreation'},
            {header: 'date_m', field:'dateMaj'},
            {header: 'user_m', field:'utilisateurMaj'},
*/
        ];

        let id = this.route.snapshot.params['idcollab'];
        if (id==undefined || id=="" )
            this.loadAllPrestations();
        else{
            this.loadPrestationsCollab(id); //console.log("liste des prestation du collab" , this.prestations);
        }

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

    loadDummy () {
        /* DUMMY !!! : */
        prestation : Prestation;
        let prestation = {
            idPrestation:1, id:1, noContrat:1, idPilot:"1", departement:"departement", pole:"pole", domaine:"domaine",
            codeSite:1, noAtg:1, idRespPole:1, idDonOrdre:1,
            pu:"pu",
            dateDebutPrest:"2018-01-01",
            dateFinPrest:"2018-01-02",
            etatPrest:"etat_prest",
            siteSg:"site_sg",
            idCommercialOpen:1,
            topAtgAtu:"top_atg_atu",
            dateCreation:"2018-01-01",
            idUtilisateurCreation:1,
            dateMaj:"2018-01-02",
            utilisateurMaj:1
        }
        this.prestations = [prestation];
    }

    loadAllPrestations() {

        this.prestationService.getAll().pipe(first()).subscribe(prestations => {
            this.prestations = prestations;
        });
    }


    loadPrestationsCollab(idemployee : number) {

        /*DUMMY : !!! */ // this.loadDummy(); this.employee_name = "dummyTEST_ME";
        // Get info collab
        this.employeeService.getById(idemployee).pipe(first()).subscribe( p_employee  => {
            this.employee = p_employee;
            this.employee_name = this.employee.prenom + " " + this.employee.nom;
        });

        this.prestationService.getPrestationsCollab(idemployee.toString()).pipe(first()).subscribe(prestations => {
            this.prestations = prestations;
        });
    }
}
