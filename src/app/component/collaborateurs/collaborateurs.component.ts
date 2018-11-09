import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/datas.service';
import {Collaborateur} from '../../model/referenciel';
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {ApiResponse} from "../../model/apiresponse";
import {PrestationsComponent} from "../prestations/prestations.component";
import {DataTable} from "primeng/primeng";
import {DatePipe} from "@angular/common";

interface filteritem {
    selected: any;
    values: SelectItem[];
    keys : string[];
    filtertype: string;
    filtercond: string;
}

@Component({
    selector: 'app-collaborateurs',
    templateUrl: './collaborateurs.component.html',
    styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

    title : string="Collaborateur";

    @ViewChild(('dt'))
    dt: DataTable;

    // Liste
    collaborateurs: Collaborateur[] = [];
    cols: any[];
    selectedColumns: any[];
    filteritem : {selected:any, values:SelectItem[], keys:string[], filtertype:string, filtercond:string };
    filtres : filteritem[] = [];
    coldefs : {header:string, field:any, filtertype:string, filtercond:string }[];
    colsIndex : string[];
    showHistSelect: boolean = false;
    // sortOptions: SelectItem[]; sortKey: string; sortField: string; sortOrder: number;

    // Fiche
    selectedCollaborateur: Collaborateur = new Collaborateur();
    displayDialog: boolean = false;

    // Références
    allstatus: { label: string, value: string }[] = [{value: "E",label:"En cours"}, {value: "T",label:"Terminées"}, {value: "S",label:"Supprimées"}, {value: "A",label:"Archivées"} ];


    private msgs: Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private columns: any;
    private apiresponse: ApiResponse;


    // PRESTATIONS
    showPrestas : string = "none";
    componentRef: any;
    @ViewChild(PrestationsComponent)
    private prestasComponent : PrestationsComponent ;
    // Dynamic prestas component : @ViewChild(AdDirective) adHost: AdDirective;
    buttonPrestationsLabels : String[] = ["Visualiser les prestations", "Masquer les prestations"]; idxBtnPrestations : number =0;

    fr:any;

    FieldsFiches : any[];

    constructor(private collaborateurService: CollaborateurService, private router: Router, private alertService: AlertService, private datePipe:DatePipe) {
    }
    /*   ngOnChanges(): void { const camelCase = require('camelcase'); }*/

    ngOnInit() {

        const camelCase = require('camelcase');

        this.coldefs = [
            {header: 'Identifiant Pilot', field: camelCase('trigramme'), filtertype : "liste", filtercond:"" },
            {header: 'Nom', field: camelCase('nom'), filtertype : "liste", filtercond:""},
            {header: 'Prénom', field: camelCase('prenom'), filtertype : "liste", filtercond:""},
            {header: 'Tél personnel', field: camelCase('tel_perso'), filtertype : "liste", filtercond:""},
            {header: 'Tél professionnel', field: camelCase('tel_pro'), filtertype : "liste", filtercond:""},
            {header: 'Catégorie', field: camelCase('categorisation'), filtertype : "liste", filtercond:""},
            {header: 'S/T', field: camelCase('stt'), filtertype : "liste", filtercond:""},
            {header: 'Statut', field: camelCase('statut_collab'), filtertype : "liste", filtercond:""},
            {header: 'Version', field: camelCase('version_collab'), filtertype : "liste", filtercond:""},
            {header: 'Mail SG', field: camelCase('mail_sg'), filtertype : "liste", filtercond:""},
            {header: 'Mail Open', field: camelCase('mail_open'), filtertype : "liste", filtercond:""},
            {header: 'Société STT', field: camelCase('societe_stt'), filtertype : "liste", filtercond:""},
            {header: 'Pré embauche ', field: camelCase('pre_embauche'), filtertype : "liste", filtercond:""},
            {header: 'Date embauche', field: camelCase('date_embauche_open'), filtertype : "liste", filtercond:""}
            //{header: 'created_at', field: camelCase('created_at')},
            //{header: 'created_by', field: camelCase('created_by')},
            //{header: 'updated_at', field: camelCase('updated_at')},
            //{header: 'updated_by', field: camelCase('updated_by')}
        ];

        this.selectColumns();
        this.createColsIndex();

        this.FieldsFiches=[
            {grp: "Collab", grplabel : "Informations collaborateur", fields : ["trigramme", "nom", "prenom", "categorisation", "stt"]},
            {grp: "Mission", grplabel : "Informations Mission", fields : []},
            {grp: "ST", grplabel : "Informations Sous-Traitance", fields : ["societeStt", "preEmbauche", "dateEmbaucheOpen"]},
            {grp: "Contact", grplabel : "Informations de contact", fields : ["telPerso", "telPro", "mailOpen", "mailSg"]}
        ];

        this.initFilters();

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

        this.loadAllCollaborateurs();


        // this.colsplice = this.selectedColumns; this.colsplice.splice(1,10);
        // Prestations (dynamique) : this.loadPrestationComponent();
    }

    // onDialogHide() { this.selectedCollaborateur = null;  }

    loadAllCollaborateurs() {

        this.collaborateurService.list()
            .pipe(first())
            .subscribe(
                collaborateurs => {
                    this.collaborateurs = collaborateurs.sort(this.orderTrigrammeVersion);
                    this.updateFilters();
                },
                error => {
                    this.alertService.error(error);
                });
    }

    // Tri sur trigramme (asc) et version (desc)
    orderTrigrammeVersion(a, b) {
        let after = 0;
        var trigramme = "trigramme";
        var version = "versionCollab";
        after = a[trigramme] > b[trigramme] ? 1 : a[trigramme] < b[trigramme] ? -1 : 0;
        if (after == 0) {
            after = a[version] > b[version] ? -1 : a[version] < b[version] ? 1 : 0;
        }
        return after;
    }

    selectColumns() {
        this.cols = [];
        this.coldefs.forEach(x => {
            Array.prototype.push.apply(this.cols, [ {header: x.header, field: x.field} ]);
        });

        this.selectedColumns = this.cols;
    }

    createColsIndex() {
        this.colsIndex = [];
        this.coldefs.forEach(x => {
            this.colsIndex[x.field]=x.header;
        });
    }

    initFilters() {
        // Create filterliste
        this.coldefs.forEach(x => {
            var filteritem = (x.filtertype == "liste") ? {
                selected: [], values: [],  keys: [], filtertype: x.filtertype, filtercond: x.filtercond
            } : {selected: "", values: [], keys: [], filtertype: x.filtertype, filtercond: x.filtercond};
            this.filtres[ x.field ] = filteritem;
        });
    };

    updateFilters() {

        this.showHistSelect = false;
        this.initFilters();

        var labels: string[] = [];  // Labels collabs
        this.collaborateurs.forEach(row => {

            // Get keys
            for (var column in this.filtres) {
                switch (column) {
                    case "trigramme" :
                        this.filtres[ column ].keys[ row[ column ] ] = row[ column ];
                        labels[ row[ column ] ] = row[ column ] + " (" + row.nom + " " + row.prenom + ")";
                        break;
                    default :
                        var value = row[ column ];
                        if (value == undefined || value == null ) {
                            row[column] = "";
                        }
                        else {
                            row[column] = value.trim();
                        }
                        value = row[column];
                        this.filtres[ column ].keys[ value ] = "";
                }
            }
        });

        let selectitems: SelectItem[] = [];
        for (var column in this.filtres) {
            selectitems = [];
            var selectitem = "";
            var col_sort = [];
            switch (column) {

                case "statutCollab" :
                    var statusdispos = this.allstatus;
                    // Add labels ordered as E, T, S, A
                    for (var i in statusdispos) {
                        if (this.filtres[ column ].keys.indexOf(statusdispos[ i ].value) == -1)
                            selectitems.push({label: statusdispos[ i ].label, value: statusdispos[ i ].value});
                    }
                    break;

                default :
                    // Sort
                    for (var key in this.filtres[ column ].keys) {
                        col_sort.push(key);
                    }
                    col_sort.sort();

                    // Add to liste
                    for (var k in col_sort) {
                        var label = (column == "trigramme") ? labels[ col_sort[ k ] ] : col_sort[ k ];
                        selectitems.push({label: label, value: col_sort[ k ]});
                    }
                    break;
            }

            this.filtres[ column ].values = selectitems;
        }

    }

    co_filter(field: string) {
        var value = this.filtres[ field ].selected;
        //if (this.filtres[ field ].filtertype == "date")
        //    value = this.datePipe.transform(value, 'yyyy-MM-dd');

        this.dt.filter(value, field, this.filtres[ field ].filtercond);
    }

    afficherLaSaisie(event) {
        this.displayDialog = true;
    }

    saveNewCollaborateur() {
        console.log("LOGGING:::::::::::::::::::::::");
        this.collaborateurService.createList(this.importedCollabs)
            .pipe(first())
            .subscribe(
                data => {
                    this.apiresponse = data as ApiResponse;
                    console.log("data returned = ", data);
                    this.alertService.success(this.apiresponse.message);
                    this.displayDialog = false;

                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    };
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });


    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {
        this.selectedCollaborateur = collaborateur;
        this.displayDialog = true;

        // Prestas
        this.prestasComponent.collab=this.selectedCollaborateur;
        this.prestasComponent.showCollab();
        this.prestasComponent.prestations = this.selectedCollaborateur.prestations;
        //this.prestasComponent.selectPrestations(this.selectedCollaborateur.prestations);
        this.prestasComponent.orderfilterPrestations();

        event.preventDefault();
    }

    // PRESTATIONS

    // Dynamic component load
    /*
    loadPrestationComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PrestationsComponent);
        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
    }*/

    showPrestations() {

        // Dynamic way
        //(<PrestationsComponent>this.componentRef.instance).collab = this.selectedCollaborateur;
        //(<PrestationsComponent>this.componentRef.instance).id = this.selectedCollaborateur.trigOpen;
        //(<PrestationsComponent>this.componentRef.instance).showCollab(); //ngOnInit();
        //(<PrestationsComponent>this.componentRef.instance).selectPrestations(this.selectedCollaborateur.prestations);
        this.showPrestas = (this.showPrestas=="none") ? "block" : "none";

        this.idxBtnPrestations = (this.idxBtnPrestations==0) ? 1 : 0;

        this.prestasComponent.updateFilters();
    }

    /************************************************************************************************************/


    public csvRecords: any[] = [];
    public importedCollabs: Collaborateur[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;
    externalFiles: any;
    uploadedFiles: any[] = [];


    onUpload(event: any): void {
        var filecontent = event.files[0];
        this.selectedfile = filecontent;
        if (filecontent) {
            var Reader = new FileReader();
            Reader.onload = (e: any) => {
                var contents = e.currentTarget.result;
                let csvRecordsArray = contents.split(/\r\n|\n/);

                this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
                this.importedCollabs = this.csvRecords;
                //  this.importedCollabs = contents;
                // console.log("content cdv ", contents);
            }
            Reader.readAsText(filecontent);
        } else {

            this.uploadedFiles = [];
        }

        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});

    }

    getDataRecordsArrayFromCSVFile(rows) {
        const camelCase = require('camelcase');
        // on retire les noms de colonnes
        var keys = rows.shift().split(",");

        // camel case all keys for sending to back
        keys = keys.map(x => camelCase(x));

        this.columns = keys;
        // on cree un objet "map" avec des attirbuts qui corresondent aux colonnes du fichier CSV et on affecte chaques valeurs
        return rows.map(function (row) {
            return row.split(",").reduce(function (map, val, i) {
                map[keys[i]] = val;
                return map;
            }, {});
        });
    }

    // CHECK IF FILE IS A VALID CSV FILE
    isCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }

    fileReset() {
        this.fileImportInput.nativeElement.value = "";
        this.csvRecords = [];
    }

    onSelectImage(files: any) {

    }

    onRemoveImage($event: any) {

    }

    fileChangeListener(event: any): void {
        var files = event.srcElement.files;
        if (this.isCSVFile(files[0])) {
            var input = event.target;
            var reader = new FileReader();
            reader.readAsText(input.files[0]);
            reader.onload = (data) => {
                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r\n|\n/);
                this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
                this.importedCollabs = this.csvRecords;
            }
            reader.onerror = function () {
                alert('Unable to read ' + input.files[0]);
            };
        } else {
            alert("Please import valid .csv file.");
            this.fileReset();
        }
    }

    csvUploader(event, fileuploader) {
        var filecontent = event.files[0];
        this.selectedfile = filecontent;
        if (filecontent) {
            var Reader = new FileReader();
            Reader.onload = (e: any) => {
                var contents = e.currentTarget.result;
                this.csvRecords = this.getDataRecordsArrayFromCSVFile(contents);
                this.importedCollabs = this.csvRecords;
            }
            Reader.readAsText(filecontent);
        } else {

            this.uploadedFiles = [];
        }
    }

    readcsvcontent(contents, event) {
        this.viewfile = true;
        var csvData = contents;

        console.log("csv data = ", csvData);
    }

}
