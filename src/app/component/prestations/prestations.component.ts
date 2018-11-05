import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {DatePipe} from "@angular/common";
import {Collaborateur, Prestation} from "../../model/referenciel";
import {CollaborateurService, PrestationService} from "../../service/datas.service";
import {ApiResponse} from "../../model/apiresponse";

interface filteritem {
    selected: string[];
    values: SelectItem[];
    keys: string[];
}

@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: [ './prestations.component.css' ]
})
export class PrestationsComponent implements OnInit, OnChanges {

    @Input()
    collab: Collaborateur;

    @ViewChild(('pt'))
    pt: DataTable;

    modeCollab: boolean = false;


    // Liste
    prestations: Prestation[] = [];
    cols: any[];
    selectedColumns: any[];

    // Collaborateur
    id: string;
    employee_name: string = "";
    employee: Collaborateur;

    // Fiche/Detail
    selectedPrestation: Prestation;// = new Prestation;
    displayDialogPresta: boolean = false;

    // Références
    missions: { label: string, value: number }[];
    allstatus: { label: string, value: string }[] = [ {value: "E", label: "En cours"}, {
        value: "T",
        label: "Terminées"
    }, {value: "S", label: "Supprimées"}, {value: "A", label: "Archivées"} ];

    filteritem: { selected: any, values: SelectItem[], keys: string[], type: string, filtercond: string };
    filtres: filteritem[] = [];
    coldefs: { header: string, field: string, filtertype: string, filtercond: string }[];
    showHistSelect: boolean = false;

    rowcolors: {};

    fr: any;
    private apiresponse: ApiResponse;

    //sortOptions: SelectItem[];   sortField: string;    sortOrder: number;


    constructor(private prestationService: PrestationService, private employeeService: CollaborateurService, private router: Router, private alertService: AlertService, private route: ActivatedRoute, private datePipe: DatePipe) {
    }


    ngOnInit() {

        // MODE ALL or COLLAB
        //this.sortOptions = [ {label: 'Newest First', value: '!nom'}, {label: 'Oldest First', value: 'prenom'}, {label: 'Brand', value: 'brand'}        ];
        if (this.route.snapshot.url[ 0 ].path == ("prestations")) {
            console.log("on appel toute les prestation");
            this.loadAllPrestations();
            //if this.route.snapshot.params['idcollab']; this.loadPrestationsCollab(id); //console.log("liste des prestation du collab" , this.prestations);
        }
        // Prestations from collab
        else {
            this.modeCollab = true;
        }

        // Columns
        // Cols depending on ID
        this.coldefs = [];
        Array.prototype.push.apply(this.coldefs, [
//          {header: 'Id', field:'prestId'},
//          {header: 'Id Mission', field:'prestIdMission'},
            {header: 'Identifiant Pilote', field: 'prestIdCollab', filtertype: "liste"},
            {header: 'Début', field: 'prestDateDebut', filtertype: "date", filtercond: "gte"},
            {header: 'Fin', field: 'prestDateFin', filtertype: "date", filtercond: "lte"},
            {header: 'Contrat', field: 'prestContrat', filtertype: "liste"},
            {header: 'ATG', field: 'prestATG', filtertype: "liste"},
            {header: 'Département', field: 'prestDepartement', filtertype: "liste"},
            {header: 'Pôle', field: 'prestPole', filtertype: "liste"},
            {header: 'Domaine', field: 'prestDomaine', filtertype: "liste"},
            {header: 'Site', field: 'prestSite', filtertype: "liste"},
            {header: 'PU', field: 'prestPU', filtertype: "liste"},
//          {header: 'Resp. Pôle', field:'prestRespPoleSG'},
//          {header: 'd_ordre', field:'prestDonneurOrdreSG'},
            {header: 'Type', field: 'prestType', filtertype: "liste"},
            {header: 'Statut', field: 'prestStatut', filtertype: "liste"},
            {header: 'Version', field: 'prestVersion', filtertype: ""}
            /*          {header: 'com_open', field:'prestCommercialOPEN'},

                        {header: 'date_c', field:'prestDateCreation'},
                        {header: 'user_c', field:'prestUserCreation'},
                        {header: 'date_m', field:'prestDateMaj'},
                        {header: 'user_m', field:'prestUserMaj'},
            */
        ]);

        this.selectColumns();

        this.initFilters();
        this.displayDialogPresta = false;

        // Missions
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
        this.fr = {
            firstDayOfWeek: 1,
            dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
            dayNamesShort: [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ],
            dayNamesMin: [ "di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
            monthNames: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
            monthNamesShort: [ "Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc" ],
            today: 'Aujourd\'hui',
            clear: 'Effacer'
        };

        // Presentation
        this.rowcolors = {"E": "rgba(rgba(250,200,240,1))", "T": "rgba(200,200,200,0.2)"}
    }


    showCollab() {
        this.id = this.collab.trigramme;
        this.employee_name = this.collab.prenom + " " + this.collab.nom;
    }

    selectPrestations(param_prestations: Prestation[]) {
        this.prestations = param_prestations;
        this.orderfilterPrestations();
    }

    orderfilterPrestations() {

        this.prestations.sort(this.orderDateDebutEtVersion);

        //this.filterVersions();
    }


    selectColumns() {

        this.cols = [];
        this.coldefs.forEach(x => {
            var addcol: boolean = true;
            // Cols depending on ID
            if (x.field == "prestIdCollab") {
                if (this.modeCollab)
                    addcol = false;
            }
            if (addcol)
                Array.prototype.push.apply(this.cols, [ {header: x.header, field: x.field} ]);
        });

        this.selectedColumns = this.cols;
    }

    initFilters() {
        // Create filterliste
        this.coldefs.forEach(x => {
            var filteritem = (x.filtertype == "liste") ? {
                selected: [],
                values: [],
                keys: [],
                filtertype: x.filtertype,
                filtercond: x.filtercond
            } : {selected: "", values: [], keys: [], filtertype: x.filtertype, filtercond: x.filtercond};
            this.filtres[ x.field ] = filteritem;
        });
    };

    selectPrestation(event: Event, prestation: Prestation) {
        this.selectedPrestation = prestation;
        this.displayDialogPresta = true;
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
        prestation.statutPrestation = (prestation.statutPrestation == "S") ? "E" : "S";

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

        this.prestationService.list()
            .pipe(first())
            .subscribe(prestations => {
                    this.prestations = prestations.sort(this.orderDateDebutEtVersion);
                    this.updateFilters();
                    this.filterVersions();
                    console.log("data returned = ", prestations);
                    //this.alertService.success(prestations);
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });
    }


    updateFilters() {
        this.showHistSelect = false;
        this.initFilters();


        // prestIdCollab, prestDateDebut, prestDateFin, prestContrat, prestATG, prestDepartement, prestPole, prestDomaine, prestSite, prestPU, prestType, prestStatut, prestVersion
        var labels: string[] = [];
        this.prestations.forEach(x => {

            // Retrieve trigramme if acces by table presta (done here to avoid double foreach)
            if (x.collaborateur != undefined)
                x.trigramme = x.collaborateur.trigramme;

            // Get keys
            for (var column in this.filtres) {
                switch (column) {
                    case "prestIdCollab" :
                        this.filtres[ column ].keys[ x.trigramme ] = x.trigramme;
                        labels[ x.trigramme ] = x.trigramme;
                        if (x.collaborateur != undefined) labels[ x.trigramme ] += " (" + x.collaborateur.nom + " " + x.collaborateur.prenom + ")";
                        break;
                    default :
                        this.filtres[ column ].keys[ x[ column ] ] = "";
                }
            }
        });


        let selectitems: SelectItem[] = [];
        for (var column in this.filtres) {
            selectitems = [];
            var selectitem = "";
            var col_sort = [];
            switch (column) {

                case "prestStatut" :
                    var statusdispos = this.allstatus;
                    //if (!this.modeCollab) statusdispos.splice(3,1);
                    // Add labels ordered as E, T, S, A
                    for (var i in statusdispos) {
                        if (this.filtres[ column ].keys.indexOf(statusdispos[ i ].value) == -1)
                            selectitems.push({label: statusdispos[ i ].label, value: statusdispos[ i ].value});
                    }

                    // Version
                    // this.filtres["prestVersion"] = {selected : "", values:[ {label: 'Historique', value: 'H'},  {label: 'Dernière', value: ''} ], keys:[] };
                    break;

                default : // prestIdCollab, prestContrat, prestATG, prestDepartement, prestPole, prestDomaine, prestSite, prestPU, prestType
                    // Sort
                    for (var key in this.filtres[ column ].keys) {
                        col_sort.push(key);
                    }
                    col_sort.sort();

                    // Add to liste
                    for (var k in col_sort) {
                        //if ( this.filtres[column].keys.indexOf(col_sort[k])==-1)
                        var label = (column == "prestIdCollab") ? labels[ col_sort[ k ] ] : col_sort[ k ];
                        selectitems.push({label: label, value: col_sort[ k ]});
                    }
                    break;
            }

            this.filtres[ column ].values = selectitems;
        }
        //console.log("LES FILTRES", this.filtres);

    }


    loadPrestationsCollab(idemployee) {

        // Get collab info
        this.employeeService.read(idemployee).pipe(first()).subscribe(p_employee => {
            this.employee = p_employee;
            this.employee_name = this.employee.prenom + " " + this.employee.nom;
            this.prestations = p_employee.prestations;

            this.prestations.sort(this.orderDateDebutEtVersion);
        });

        this.filterVersions();

    }


    // Tri sur datedebut (desc) et etat (desc)
    orderDateDebutEtVersion(a, b) {
        let after = 0;

        after = a.prestDateDebut > b.prestDateDebut ? -1 : a.prestDateDebut < b.prestDateDebut ? 1 : 0;
        if (after == 0) {
            after = a.prestVersion > b.prestVersion ? -1 : a.prestVersion < b.prestVersion ? 1 : 0;
        }
        return after;
    }


    filterVersions() {
        // Si E T ou S pas d'historique, si affichage complète (E T et S) également affichage Historique si coché.

        var statushist: string[];

        // Multiselect
        var status: string[] = this.filtres[ "prestStatut" ].selected; // this.selectedPrestas.status;

        /*
        // Combo : si pas de sélection : afficher tout
        if (this.selectedPrestas.statut=="") {
            status = ['E', 'T', 'S'];
            if (this.selectedPrestas.version != "") {
                //statushist=Array.from(status,x=>x+'A');
                //Array.prototype.push.apply(status, statushist);
                Array.prototype.push.apply(status, ['A']);
            }
        }
        else {
            status=[this.selectedPrestas.statut];
        }*/

        this.pt.filter(status, 'prestStatut', 'in');

    }


    pt_filter(field: string) {

        var value = this.filtres[ field ].selected;
        if (this.filtres[ field ].filtertype == "date") {
            value = this.datePipe.transform(value, 'yyyy-MM-dd');
        }

        this.pt.filter(value, field, this.filtres[ field ].filtercond);

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {

            if (propName == "collab") {
                //let curVal= changes[propName].currentValue;
                //this.showCollab();
            }
        }
    }

}
