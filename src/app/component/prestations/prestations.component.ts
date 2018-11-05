import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, Prestation} from "../../model/referenciel";
import {CollaborateurService, PrestationService} from "../../service/datas.service";

interface SelectedPrestas {
    trigcollab: string;
    statut: string;
    version: string;
}

@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: ['./prestations.component.css']
})
export class PrestationsComponent implements OnInit {

    @ViewChild(('pt')) pt: DataTable;

    // Liste
    prestations: Prestation[] = [];
    cols: any[];

    // Collaborateur
    employee_name: string = "";
    employee: Collaborateur;

    // Fiche/Detail
    selectedPrestation: Prestation = new Prestation;
    displayDialog: boolean;

    // Références
    missions: { label: string, value: number }[];
    status: SelectItem[];
    versions: SelectItem[];

    // Sélection / filtre
    selectedPrestas: SelectedPrestas = new class implements SelectedPrestas {
        statut: string;
        version: string;
        trigcollab: string;
    };


    //sortOptions: SelectItem[];   sortField: string;    sortOrder: number;


    constructor(
                private prestationService: PrestationService,
                private employeeService: CollaborateurService,
                private router: Router,
                private alertService: AlertService,
                private route: ActivatedRoute) {}

    ngOnInit() {

        //this.sortOptions = [ {label: 'Newest First', value: '!nom'}, {label: 'Oldest First', value: 'prenom'}, {label: 'Brand', value: 'brand'}        ];

        // ID
        let id = this.route.snapshot.params['idcollab'];

        // Cols depending on ID
        this.cols = [];
        if (id == undefined || id == "")
            Array.prototype.push.apply(this.cols, [{header: 'Identifiant Pilote', field: 'identifiantPilote'}]); //

        Array.prototype.push.apply(this.cols, [
//          {header: 'Id', field:'prestId'},
//          {header: 'Id Mission', field:'prestIdMission'},
            {header: 'Début', field: 'dateDebutPrestation'},
            {header: 'Fin', field: 'dateFinPrestation'},
            {header: 'Contrat', field: 'contratDAppli'},
            {header: 'ATG', field: 'numeroAtg'},
            {header: 'Département', field: 'equipeDepartement'},
            {header: 'Pôle', field: 'equipePole'},
            {header: 'Domaine', field: 'equipeDomaine'},
            {header: 'Site', field: 'localisation'},
            {header: 'PU', field: 'numeroPu'},
//          {header: 'Resp. Pôle', field:'prestRespPoleSG'},
//          {header: 'd_ordre', field:'prestDonneurOrdreSG'},
 //           {header: 'Type', field: 'prestType'},
            {header: 'Statut', field: 'statutMission'},
            {header: 'Version', field: 'versionPrestation'}
/*          {header: 'com_open', field:'prestCommercialOPEN'},

            {header: 'date_c', field:'prestDateCreation'},
            {header: 'user_c', field:'prestUserCreation'},
            {header: 'date_m', field:'prestDateMaj'},
            {header: 'user_m', field:'prestUserMaj'},
*/
        ]);


        if (id == undefined || id == "") {
            // Filter
            this.selectedPrestas.version = "A";
            this.selectedPrestas.statut = "";
            this.selectedPrestas.trigcollab = ""; //tsc

            this.loadAllPrestations();
        }
        else {
            this.loadPrestationsCollab(id); //console.log("liste des prestation du collab" , this.prestations);
        }

        this.displayDialog = false;


    }


    selectPrestation(event: Event, prestation: Prestation) {
        this.selectedPrestation = prestation;
        this.displayDialog = true;
        event.preventDefault();
    }

    savePrestation(event: Event, prestation: Prestation) {
        this.prestationService.create(prestation)
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

    deletePrestation(event: Event, prestation: Prestation) {
        prestation.statutMission = (prestation.statutMission == "S") ? "E" : "S";

        this.prestationService.create(prestation)
            .pipe(first())
            .subscribe(
                data => {
                },
                error => {
                    this.alertService.error(error);
                });
    }

  /*  deletePrestation(event: Event, id: number) {
        this.prestationService.delete(id)
            .pipe(first())
            .subscribe(
                data => {
                },
                error => {
                    this.alertService.error(error);
                });
    }*/


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

        this.prestationService.list().pipe(first()).subscribe(prestations => {

            this.prestations = prestations.sort(this.orderDateDebutEtVersion);

            this.prestations.map(x => {
                x.identifiantPilote = x.collaborateur.trigramme;
            });

            this.pt.filter(this.selectedPrestas.statut, 'prestStatut', 'equals');
            this.pt.filter(this.selectedPrestas.version, 'prestVersionActuelle', 'equals');
        });
    }


    loadPrestationsCollab(idemployee) {

        // Get collab info
        this.employeeService.read(idemployee).pipe(first()).subscribe(p_employee => {
            this.employee = p_employee;
            this.employee_name = this.employee.prenom + " " + this.employee.nom;
            this.prestations = p_employee.prestations;

            this.prestations.sort(this.orderDateDebutEtVersion);
        });
        // ... et ses prestations
        //this.prestationService.getPrestationsCollab(idemployee).pipe(first()).subscribe(prestations => {
        //    this.prestations = prestations;
        //});
    }


    // Tri sur datedebut (desc) et etat (desc)
    orderDateDebutEtVersion(a, b) {
        let after = 0;

        after = a.dateDebutPrestation > b.dateDebutPrestation ? -1 : a.dateDebutPrestation < b.dateDebutPrestation ? 1 : 0;
        if (after == 0) {
            after = a.versionPrestation > b.versionPrestation ? -1 : a.versionPrestation < b.versionPrestation ? 1 : 0;
        }
        return after;
    }


}
