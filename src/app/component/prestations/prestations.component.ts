import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {PrestationService} from '../../service/prestation.service';
import {Prestation} from '../../model/prestation';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';
import {AlertService} from "../../service/alert.service";


@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: ['./prestations.component.css']
})
export class PrestationsComponent implements OnInit {

    selectedPrestation: Prestation = new Prestation;
    displayDialog: boolean;
    cols :any[];
    prestations: Prestation[] = [];
    employee_name : string = "";
    employee : Collaborateur;
    missions : {label :string, value : number}[];
    status : SelectItem[];

    //sortOptions: SelectItem[];   sortField: string;    sortOrder: number;

    constructor( private prestationService: PrestationService, private employeeService : CollaborateurService, private router: Router, private alertService: AlertService, private route: ActivatedRoute) { }

    ngOnInit() {

        //this.sortOptions = [ {label: 'Newest First', value: '!nom'}, {label: 'Oldest First', value: 'prenom'}, {label: 'Brand', value: 'brand'}        ];
        let id = this.route.snapshot.params['idcollab'];

        this.cols=[];
        if (id==undefined || id=="" )
            Array.prototype.push.apply(this.cols,[{header:'Identifiant Pilote', field:'prestIdPilote'} ]); //

        Array.prototype.push.apply(this.cols, [
//            {header: 'Id', field:'prestId'},
//            {header: 'Id Mission', field:'prestIdMission'},
//            {header: 'Contrat', field:'prestContrat'},
            {header: 'Début', field:'prestDateDebut'},
            {header: 'Fin', field:'prestDateFin'},
            {header: 'ATG', field:'prestATG'},
            {header: 'Département', field:'prestDepartement'},
            {header: 'Pôle', field:'prestPole'},
            {header: 'Domaine', field:'prestDomaine'},
            {header: 'Site', field:'prestSite'},
            {header: 'PU', field:'prestPU'},

//            {header: 'Resp. Pôle', field:'prestRespPoleSG'},
//            {header: 'd_ordre', field:'prestDonneurOrdreSG'},
            {header: 'Type', field:'prestType'},
            {header: 'Version', field:'prestVersion'},
            {header: 'Statut', field:'prestStatut'}
/*            {header: 'com_open', field:'prestCommercialOPEN'},

            {header: 'date_c', field:'prestDateCreation'},
            {header: 'user_c', field:'prestUserCreation'},
            {header: 'date_m', field:'prestDateMaj'},
            {header: 'user_m', field:'prestUserMaj'},
*/       ]);

        if (id==undefined || id=="" )
            this.loadAllPrestations();
        else{
            this.loadPrestationsCollab(id); //console.log("liste des prestation du collab" , this.prestations);
        }

        this.displayDialog = false;

        this.missions = [
            {label: 'Aubi', value: 1},
            {label: 'Bamz', value: 2},
            {label: 'Fita', value: 3},
            {label: 'Forud', value: 4},
            {label: 'Honada', value: 5},
            {label: 'Jagar', value: 6},
            {label: 'Mercedes', value: 7},
            {label: 'Renaud', value: 8},
            {label: 'Vewa', value: 9},
            {label: 'Vovo', value: 10}
        ];

        this.status = [
            {label: 'Tous', value: ''},
            {label: 'En cours', value: 'E'},
            {label: 'Terminée', value: 'T'},
            {label: 'Supprimée', value: 'S'}
        ];

    }


    selectPrestation(event: Event, prestation: Prestation) {
        this.selectedPrestation = prestation;
        this.displayDialog = true;
        event.preventDefault();
    }

    savePrestation(event: Event, prestation: Prestation) {
        this.prestationService.save(prestation)
            .pipe(first())
            .subscribe(
                data => {
                    // To do : message save ok
                    //this.router.navigate(["/prestations"]);
                },
                error => {
                    this.alertService.error(error);
                });
    }

    deletePrestation(event: Event, id : number) {
        this.prestationService.delete(id)
            .pipe(first())
            .subscribe(
                data => {
                    // To do : hide row
                },
                error => {
                    this.alertService.error(error);
                });
    }


    /*onSortChange(event) {
        const field = event.field;

        if (field.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = field.substring(1, field.length);
        } else {
            this.sortOrder = 1;
            this.sortField = field;
        }
    }*/

    onDialogHide() {
        this.selectedPrestation = null;
    }


    loadAllPrestations() {

        this.prestationService.getAll().pipe(first()).subscribe(prestations => {
            this.prestations = prestations.sort( this.orderDateDebutEtVersion );
            this.prestations.map(x => x.prestIdPilote = x.collaborateur.trigOpen);
        });
    }


    loadPrestationsCollab(idemployee) {

        // Get collab info
        this.employeeService.getById(idemployee).pipe(first()).subscribe( p_employee  => {
            this.employee = p_employee;
            this.employee_name = this.employee.prenom + " " + this.employee.nom;
            this.prestations = p_employee.prestations;
            this.prestations.sort( this.orderDateDebutEtVersion );
        });
        // ... et ses prestations
        //this.prestationService.getPrestationsCollab(idemployee).pipe(first()).subscribe(prestations => {
        //    this.prestations = prestations;
        //});
    }


    // Tri sur datedebut (desc) et etat (desc)
    orderDateDebutEtVersion(a,b) {
        let after=0;

        after = a.prestDateDebut > b.prestDateDebut ? -1 : a.prestDateDebut < b.prestDateDebut ? 1 : 0;
        if (after==0) {
            after = a.prestVersion > b.prestVersion ? -1 : a.prestVersion < b.prestVersion ? 1 : 0;
        }
        return after;
    }


}
