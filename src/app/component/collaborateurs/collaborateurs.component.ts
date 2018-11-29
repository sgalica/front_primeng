import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CategorieService, CollaborateurService} from '../../service/datas.service';
import {Collaborateur, Mission} from '../../model/referentiel';
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
    styleUrls: ['./collaborateurs.component.css'],
    providers : [CollaborateurService ]
})
export class CollaborateursComponent implements OnInit {

    title : string="Collaborateur";

    @ViewChild(('dt'))
    dt: DataTable;

    // Liste
    collaborateurs: Collaborateur[] = [];
    cols        : any[];
    selectedColumns: any[];
    filterlist = { selected: [], values: [], keys: [] };
    filterdate = { selected: "", values: "", keys: [] };
    coldefs     : {}; // { header: string, field: any, filtertype: string, filtercond: string, showInList:boolean }[];
    showHistSelect: boolean = false;
    // sortOptions: SelectItem[]; sortKey: string; sortField: string; sortOrder: number;

    // Fiche
    selectedCollaborateur: Collaborateur = new Collaborateur();
    displayDialog : boolean = false;
    displayDialog2: boolean = false;
    lastMission   : Mission = new Mission();

    // Références
    allstatus    : { label: string, value: string }[] = [{value: "E",label:"En cours"}, {value: "T",label:"Terminées"}, {value: "S",label:"Supprimées"}, {value: "A",label:"Archivées"} ];
    allstatusidx : Object;
    references   : any[]=[];

    ouinon       : { label: string, value: string }[] = [{value: "Oui", label: "Oui"}, {value: "Non", label: "Non"} ];

    private msgs    : Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private columns : any;
    private apiresponse: ApiResponse;


    // PRESTATIONS
    showPrestas : string = "none";
    componentRef: any;
    @ViewChild(PrestationsComponent)
    private prestasComponent : PrestationsComponent ;
    // Dynamic prestas component : @ViewChild(AdDirective) adHost: AdDirective;
    buttonPrestationsLabels : String[] = ["Visualiser les prestations", "Visualiser les prestations"]; idxBtnPrestations : number =0;
    buttons_list : String[] = ["Save","Create","Prestas","EndMission","Delete", "ReOpen", "Cancel"];
    buttons     : Object;
    
    fr  : any;
    datefmt = "dd/mm/yy";
    datefmtCalendarInput = "dd/MM/yyyy";

    FieldsFiches : any[];

    constructor(private collaborateurService: CollaborateurService, private categorieService: CategorieService,
                private router: Router, private alertService: AlertService, private datePipe:DatePipe) {
    }
    /*   ngOnChanges(): void { const camelCase = require('camelcase'); }*/

    ngOnInit() {

        this.displayDialog2 = false;

        const camelCase = require('camelcase');
        var filterlist = this.filterlist; var filterdate = this.filterdate;

        this.coldefs = {
            trigramme :      {header: 'Identifiant Pilot',   filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            nom :            {header: 'Nom',                 filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            prenom :         {header: 'Prénom',              filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            telPerso :       {header: 'Tél personnel',       filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            telPro :         {header: 'Tél professionnel',   filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            categorisation : {header: 'Catégorie',           filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            stt :            {header: 'S/T',                 filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            statutCollab :   {header: 'Statut',              filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            versionCollab :  {header: 'Version',             filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            mailSg:          {header: 'Mail SG',             filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            mailOpen:        {header: 'Mail Open',           filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            societeStt:      {header: 'Société STT',         filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            preEmbauche:     {header: 'Pré embauche ',       filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            dateEmbaucheOpen:{header: 'Date embauche',       filtertype : "liste",  filtercond:"", filter:filterlist, showInList:true},
            // + Mission :
            dateDebutMission:{header:"Date début",           filtertype : "",       filtercond:"", filter:filterlist, showInList:false},
            dateFinSg:       {header:"Date fin",             filtertype : "",       filtercond:"", filter:filterlist, showInList:false},
            dateA3Ans:       {header:"Date à 3 ans",         filtertype : "",       filtercond:"", filter:filterlist, showInList:false},
            derogation:      {header:"Dérogation",           filtertype : "",       filtercond:"", filter:filterlist, showInList:false},
            statutMission:   {header:"Statut",               filtertype : "",       filtercond:"", filter:filterlist, showInList:false},
            versionMission:  {header:"Version",              filtertype : "",       filtercond:"", filter:filterlist, showInList:false}
            //{header: 'created_at', field: camelCase('created_at')},
            //{header: 'created_by', field: camelCase('created_by')},
            //{header: 'updated_at', field: camelCase('updated_at')},
            //{header: 'updated_by', field: camelCase('updated_by')}
        };

        this.selectColumns();
        this.createStatusIndex();

        this.FieldsFiches=[
            {grp: "Collab", grplabel : "Informations collaborateur", fields : ["trigramme", "nom", "prenom", "categorisation", "stt"]},
            {grp: "Mission", grplabel : "Informations Mission", fields : ["dateDebutMission", "dateFinSg", "dateA3Ans", "derogation", "statutMission", "versionMission" ]},
            {grp: "ST", grplabel : "Informations Sous-Traitance", fields : ["societeStt", "preEmbauche", "dateEmbaucheOpen"]},
            {grp: "Contact", grplabel : "Informations de contact", fields : ["telPerso", "telPro", "mailOpen", "mailSg"]}
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

        this.buttons = {
            "Save"      : {label:"Enregistrer",                 disabled:true,  fnc : ()=>{this.saveCollaborateur();} },
            "Create"    : {label:"Créer une prestation",        disabled:true,  fnc : ()=>{this.newPrestation();} },
            "Prestas"   : {label:this.buttonPrestationsLabels[0],disabled:false,fnc : ()=>{this.showPrestations();} },
            "EndMission": {label:"Terminer la mission",         disabled:true,  fnc : ()=>{this.endMission();} },
            "Delete"    : {label:"Supprimer le collaborateur",  disabled:true,  fnc : ()=>{this.suppCollab();} },
            "ReOpen"    : {label:"Réactiver le collaborateur",  disabled:true },
            "Cancel"    : {label:"Annuler",                     disabled:true }
        };

        this.loadAllCollaborateurs();

        this.loadCategorisations();
        // this.colsplice = this.selectedColumns; this.colsplice.splice(1,10);
        // Prestations (dynamique) : this.loadPrestationComponent();
    }

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

    loadCategorisations() {
        this.references["categorisations"] = [];

        var fld = {ref:"categorisations", key:"categorisation", label:"categorisation", labelbis:"libelle"} ;
        this.loadTableKeyValues(fld, this.categorieService, this.references );
    }

    loadTableKeyValues(fld, tableService, itemsarray) {
        tableService.list()
            .pipe(first())
            .subscribe(
                rows => {
                    itemsarray[fld.ref]=[];
                    var label="";
                    rows.forEach( x => {
                            label = x[fld.label];
                            if (fld.labelbis!="")
                                label += " (" + x[fld.labelbis]+")"
                            itemsarray[fld.ref].push({ value: x[fld.key], label: label  });
                        }
                    );
                    itemsarray[fld.ref].sort(this.orderSelectItems);
                },
                error => { this.alertService.error(error); }
            );
    }


    // Tri sur trigramme (asc) et version (desc)
    orderTrigrammeVersion(a, b) {
        var fld="trigramme";
        let after = (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0;
        fld = "versionCollab";
        return (after != 0) ? after : (a[fld] > b[fld]) ? -1 : (a[fld] < b[fld]) ? 1 : 0;
    }

    orderSelectItems(a, b) {
        var fld="value";
        return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0;
    }


    selectColumns() {
        this.selectedColumns = [];
        for( var key in this.coldefs) {
             if (this.coldefs[key].showInList)
                this.selectedColumns.push( {header: this.coldefs[key].header, field: key} );
        }
        this.cols=this.selectedColumns;
    }

    createStatusIndex() {
        this.allstatusidx = {};
        this.createMap(this.allstatus, this.allstatusidx, "value", "label" );
    }

    createMap(arrin, arrout, fldkey, fldvalue) { arrin.forEach( x => { arrout[ x[fldkey] ] = x[fldvalue]; }); }


    updateFilters() {

        // Clear
        for( var column in this.coldefs) {
            this.coldefs[column].filter = (this.coldefs[column].filtertype == "liste") ? this.filterlist : this.filterdate;
        }

        this.showHistSelect = false;

        // Get keys
        var labels: string[] = [];  // Labels collabs
        this.collaborateurs.forEach(row => {

            for( var column in this.coldefs) {
                // Clear
                this.coldefs[column].filter = (this.coldefs[column].filtertype == "liste") ? this.filterlist : this.filterdate;
                switch (column) {
                    case "trigramme" :
                        this.coldefs[column].filter.keys[ row[ column ] ] = row[ column ];
                        labels[ row[ column ] ] = row[ column ] + " (" + row.nom + " " + row.prenom + ")";
                        break;
                    default :
                        row[column] = (row[column] == undefined || row[column] == null ) ? "" : row[column].trim();
                        this.coldefs[column].filter.keys[ row[column] ] = "";
                }
            }
        });

        let selectitems: SelectItem[] = [];
        for (var column in this.coldefs) {
            selectitems = [];
            var selectitem = "";
            var col_sort = [];
            switch (column) {

                case "statutCollab" :
                    var statusdispos = this.allstatus;
                    // Add labels ordered as E, T, S, A
                    for (var i in statusdispos) {
                        if (this.coldefs[ column ].filtre.keys.indexOf(statusdispos[ i ].value) == -1)
                            selectitems.push({label: statusdispos[ i ].label, value: statusdispos[ i ].value});
                    }
                    break;

                default :
                    // Sort
                    for (var key in this.coldefs[ column ].filtre.keys) {
                        col_sort.push(key);
                    }
                    col_sort.sort();

                    // Add to liste
                    for (var k in col_sort) {
                        var label = (col_sort[k]=="")? " [ Vide ]" : (column == "trigramme") ? labels[ col_sort[ k ] ] : col_sort[ k ];
                        selectitems.push({label: label, value: col_sort[ k ]});
                    }
                    break;
            }

            this.coldefs[ column ].filtre.values = selectitems;
        }

    }

    // Filtrer liste collaborateurs
    co_filter(field: string) {
        var value = this.coldefs[ field ].filtre.selected;
        //if (this.filtres[ field ].filtertype == "date")
        //    value = this.datePipe.transform(value, 'yyyy-MM-dd');
        this.dt.filter(value, field, this.coldefs[ field ].filtercond);
    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {

        this.selectedCollaborateur = collaborateur;
        this.displayDialog = true;

        // Last mission
        this.lastMission = null;
        this.buttons["Delete"].disabled=true;
        this.selectedCollaborateur.missions.forEach(x => {
            var dateArr = x['dateDebutMission'].split("/"); //dd/mm/yyyy
            var dateMission = new Date(dateArr[2], dateArr[1], dateArr[0]);
            var datelastMission = new Date(0);
            if (this.lastMission!=null && typeof this.lastMission['dateDebutMission'] == "string") {
                dateArr = this.lastMission['dateDebutMission'].split("/");
                datelastMission = new Date(dateArr[2], dateArr[1], dateArr[0]);
            }
            if ( dateMission > datelastMission ) {
               this.lastMission = x;
            }
        });
        if (!this.lastMission)
            this.buttons["Delete"].disabled=false;

        event.preventDefault();
    }

    afficherLaSaisie(event) {
        this.displayDialog = true;
    }

    buttonsFunctions(btn:string) {
        this.buttons[btn].fnc.call();
    }
    saveCollaborateur() { }
    newPrestation() { }
    endMission() { }
    suppCollab() { }

    // PRESTATIONS
    /* // Dynamic component load
    loadPrestationComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PrestationsComponent);
        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
    }*/

    showPrestations() {

        this.displayDialog2=true;
        //this.prestasComponent.showCollab(this.selectedCollaborateur);

        // Dynamic way :
        //(<PrestationsComponent>this.componentRef.instance).collab = this.selectedCollaborateur;
        //(<PrestationsComponent>this.componentRef.instance).id = this.selectedCollaborateur.trigOpen;
        //(<PrestationsComponent>this.componentRef.instance).showCollab(); //ngOnInit();
        //(<PrestationsComponent>this.componentRef.instance).selectPrestations(this.selectedCollaborateur.prestations);
    }


    onClosewindowPrestas() {
        this.displayDialog2=false;
    }
    




    /************************************************************************************************************/
    saveimportedCollaborateurs() {
        console.log("LOGGING:::::::::::::::::::::::");
        this.collaborateurService.createList(this.importedCollabs)
            .pipe(first())
            .subscribe(
                data => {
                    this.apiresponse = data as ApiResponse;
                    console.log("data returned = ", data);
                    this.alertService.success(this.apiresponse.message);
                    this.displayDialog = false;
                    this.displayDialog2 = false;

                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    };
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });
    }


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
