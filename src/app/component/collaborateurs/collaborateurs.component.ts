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
import {CommunATGService} from "../../service/communATG.service"

@Component({
    selector: 'app-collaborateurs',
    templateUrl: './collaborateurs.component.html',
    styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

    title : string = "Collaborateur";

    @ViewChild(('dt'))
    dt: DataTable;

    // Liste
    collaborateurs  : Collaborateur[] = [];
    cols            : any[];
    selectedColumns : any[];
    coldefs         : {}; // { header: string, field: any, filtertype: string, filtercond: string, showInList:boolean, selected, values, keys }[];
    showHistSelect  : boolean = false;
    // sortOptions: SelectItem[]; sortKey: string; sortField: string; sortOrder: number;

    // Fiche
    selectedCollaborateur : Collaborateur = new Collaborateur();
    selectedEmployeeOriginalValue : Collaborateur;
    displayDialog : boolean = false;
    displayDialog2: boolean = false;
    lastMission   : Mission = new Mission();

    // Références
    allstatus = { E: "En cours", T: "Terminé", S: "Supprimé", A: "Archivé"};
    allStatusComboOptions = {};

    references   : any[]=[];

    ouinonComboOptions : { label: string, value: string }[] = [{value: "Oui", label: "Oui"}, {value: "Non", label: "Non"} ];

    private msgs    : Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private columns : any;
    private apiresponse : ApiResponse;


    // PRESTATIONS
    showPrestas : string = "none";
    componentRef: any;
    @ViewChild(PrestationsComponent)
    private prestasComponent : PrestationsComponent ;
    // Dynamic prestas component : @ViewChild(AdDirective) adHost: AdDirective;
    buttonPrestationsLabels : String[] = ["Visualiser les prestations", "Visualiser les prestations"]; idxBtnPrestations : number =0;
    buttonsList    : String[] = ["Save","Create","Prestas","EndMission","Delete", "ReOpen", "Cancel"];
    buttons        : Object;

    FieldsFiches : any[];
    FieldsFichesVisu : any[];
    FieldsFichesCreation : any[];

    communServ : CommunATGService;
    styleObligatoire : string = "obligatoire"; // : object = {'border-bottom':'lightsteelblue solid thin'};
    //styleNormal : string = "";
    constructor(private collaborateurService: CollaborateurService, private categorieService: CategorieService,
                private router: Router, private alertService: AlertService, private communATGService : CommunATGService) {
    }
    /*   ngOnChanges(): void { }*/

    ngOnInit() {

        this.communServ = this.communATGService;

        this.displayDialog2 = false;

        const camelCase = require('camelcase');

        this.coldefs = {
            trigramme :      {header: 'Identifiant Pilot',   filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:true},
            nom :            {header: 'Nom',                 filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            prenom :         {header: 'Prénom',              filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            telPerso :       {header: 'Tél personnel',       filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            telPro :         {header: 'Tél professionnel',   filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            categorisation : {header: 'Catégorie',           filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            stt :            {header: 'S/T',                 filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            statutCollab :   {header: 'Statut',              filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            versionCollab :  {header: 'Version',             filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            mailSg:          {header: 'Mail SG',             filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            mailOpen:        {header: 'Mail Open',           filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            societeStt:      {header: 'Société STT',         filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            preEmbauche:     {header: 'Pré embauche ',       filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            dateEmbaucheOpen:{header: 'Date embauche',       filtertype : "liste",  filtercond:"", selected: [], values: [], keys: {}, showInList:true, keycol:false},
            // + Mission :
            dateDebutMission:{header:"Date début",           filtertype : "",       filtercond:"", selected: "", values: "", keys: {}, showInList:false, keycol:false},
            dateFinSg:       {header:"Date fin",             filtertype : "",       filtercond:"", selected: "", values: "", keys: {}, showInList:false, keycol:false},
            dateA3Ans:       {header:"Date à 3 ans",         filtertype : "",       filtercond:"", selected: "", values: "", keys: {}, showInList:false, keycol:false},
            derogation:      {header:"Dérogation",           filtertype : "",       filtercond:"", selected: [], values: [], keys: {}, showInList:false, keycol:false},
            statutMission:   {header:"Statut",               filtertype : "",       filtercond:"", selected: [], values: [], keys: {}, showInList:false, keycol:false},
            versionMission:  {header:"Version",              filtertype : "",       filtercond:"", selected: [], values: [], keys: {}, showInList:false, keycol:false}
            //{header: 'created_at', field: camelCase('created_at')},
            //{header: 'created_by', field: camelCase('created_by')},
            //{header: 'updated_at', field: camelCase('updated_at')},
            //{header: 'updated_by', field: camelCase('updated_by')}
        };

        this.selectColumns();
        this.FieldsFichesVisu=[
            {grp: "Collab",     grplabel : "Informations collaborateur",    fields : [{name:"trigramme",        type:"field", obligatoire:""},                      {name:"nom",         type:"field", obligatoire:""}, {name:"prenom",      type:"field", obligatoire:""}, {name:"categorisation",  type:"combo", obligatoire:this.styleObligatoire}, {name:"stt",             type:"combo", obligatoire:""}]},
            {grp: "Mission",    grplabel : "Informations Mission",          fields : [{name:"dateDebutMission", type:"date", obligatoire:""},                       {name:"dateFinSg",   type:"date",  obligatoire:""}, {name:"dateA3Ans",   type:"date", obligatoire:""},  {name:"derogation",      type:"field", obligatoire:""}, {name:"statutMission",   type:"combo", obligatoire:""}, {name:"versionMission", type:"field", obligatoire:""} ]},
            {grp: "ST",         grplabel : "Informations Sous-Traitance",   fields : [{name:"societeStt",       type:"field", obligatoire:this.styleObligatoire},   {name:"preEmbauche", type:"combo", obligatoire:""}, {name:"dateEmbaucheOpen", type:"date", obligatoire:""}]},
            {grp: "Contact",    grplabel : "Informations de contact",       fields : [{name:"telPerso",         type:"field", obligatoire:""},                      {name:"telPro",      type:"field", obligatoire:""}, {name:"mailOpen",    type:"field", obligatoire:""}, {name:"mailSg",          type:"field", obligatoire:""}]}
        ];

        this.FieldsFichesCreation=[
            {grp: "Collab",     grplabel : "Informations collaborateur",    fields : [{name:"trigramme",        type:"field", obligatoire:""},                      {name:"nom",         type:"field", obligatoire:""}, {name:"prenom",      type:"field", obligatoire:""}, {name:"categorisation",  type:"combo", obligatoire:this.styleObligatoire}, {name:"stt",             type:"combo", obligatoire:""}]},
            {grp: "Mission",    grplabel : "Informations Mission",          fields : [{name:"dateDebutMission", type:"date", obligatoire:""},                       {name:"dateFinSg",   type:"date",  obligatoire:""}, {name:"dateA3Ans",   type:"date", obligatoire:""},  {name:"derogation",      type:"field", obligatoire:""} ]},
            {grp: "ST",         grplabel : "Informations Sous-Traitance",   fields : [{name:"societeStt",       type:"field", obligatoire:this.styleObligatoire},   {name:"preEmbauche", type:"combo", obligatoire:""}, {name:"dateEmbaucheOpen", type:"date", obligatoire:""}]},
            {grp: "Contact",    grplabel : "Informations de contact",       fields : [{name:"telPerso",         type:"field", obligatoire:""},                      {name:"telPro",      type:"field", obligatoire:""}, {name:"mailOpen",    type:"field", obligatoire:""}, {name:"mailSg",          type:"field", obligatoire:""}]}
        ];

        this.FieldsFiches = this.FieldsFichesVisu;

        this.buttons = {
            "Save"      : {label:"Enregistrer",                 disabled:true,  fnc : ()=>{this.save();} },
            "Create"    : {label:"Créer une prestation",        disabled:true,  fnc : ()=>{this.newPrestation();} },
            "Prestas"   : {label:this.buttonPrestationsLabels[0],disabled:false,fnc : ()=>{this.showPrestations();} },
            "EndMission": {label:"Terminer la mission",         disabled:true,  fnc : ()=>{this.endMission();} },
            "Delete"    : {label:"Supprimer le collaborateur",  disabled:true,  fnc : ()=>{this.suppCollab();} },
            "ReOpen"    : {label:"Réactiver le collaborateur",  disabled:true },
            "Cancel"    : {label:"Annuler",                     disabled:true,  fnc : ()=>{this.cancelEditCollab();} }
        };

        this.allStatusComboOptions = this.communServ.filterSelectItems(this.allstatus, this.allstatus );

        this.loadAllCollaborateurs();

        this.loadCategorisations();
        // this.colsplice = this.selectedColumns; this.colsplice.splice(1,10);
        // Prestations (dynamique) : this.loadPrestationComponent();
    }

    selectColumns() {
        this.selectedColumns = this.communServ.filterTableSelectItems(this.coldefs, 'showInList', 'header');
        this.cols = this.selectedColumns;
    }

    loadAllCollaborateurs() {

        this.collaborateurService.list().pipe(first()).subscribe(
        collaborateurs => {
            this.collaborateurs = collaborateurs.sort(this.orderTrigrammeVersion);
            this.updateFilters();
        },
        error => { this.alertService.error(error);  }
        );
    }

    loadCategorisations() {
        this.references["categorisations"] = [];

        var flds = [{ref:"categorisations", key:"categorisation", label:"categorisation", labelbis:"libelle"}] ;
        
        this.communServ.loadTableKeyValues(flds, this.categorieService, this.references, null, true );
    }

    updateFilters() {

        // Clear
        if (this.communServ) {
            this.communServ.clearTableCol(this.coldefs, "values",   "filtertype", "liste", [], "");
            this.communServ.clearTableCol(this.coldefs, "selected", "filtertype", "liste", [], "");
            this.communServ.clearTableCol(this.coldefs, "keys",     "filtertype", "liste", [], []);
        }
        this.showHistSelect = false;


        // Get keys
        var labels: string[] = [];  // Labels collabs
        this.collaborateurs.forEach(row => {
            this.communServ.setKeys(this.coldefs, row );
            this.communServ.setLabel(labels, row, "trigramme",["nom", "prenom"]);
        });

        // Create SelectItems of columns from keys
        for (var column in this.coldefs) {
            let selectitems : SelectItem[] ;

            switch (column) {

                case "statutCollab" :
                    // Add labels ordered as E, T, S, A
                    selectitems = this.communServ.filterSelectItems(this.allstatus, this.coldefs[ column ].keys);
                    break;

                default :
                    // Sort keys
                    var colSort = this.communServ.convertMapToArray(this.coldefs[ column ].keys); colSort.sort();
                    // Add to liste
                    selectitems = this.communServ.createSelectItemsFromArray(colSort, labels );
                    break;
            }
            this.coldefs[ column ].values = selectitems;
        }
    }

    // Tri sur trigramme (asc) et version (desc)
    orderTrigrammeVersion(a, b) {
        var fld = "trigramme";
        var vala = a[fld].substr(0,8);
        var valb = b[fld].substr(0,8);
        let after = (vala > valb) ? 1 : (vala < valb) ? -1 : 0;
        fld = "versionCollab";
        return (after != 0) ? after : (a[fld] > b[fld]) ? -1 : (a[fld] < b[fld]) ? 1 : 0;
    }

    // Filtrer liste collaborateurs
    co_filter(field: string) {
        var value = this.coldefs[ field ].selected;
        //if (this.filtres[ field ].filtertype == "date")
        //    value = this.datePipe.transform(value, 'yyyy-MM-dd');
        this.dt.filter(value, field, this.coldefs[ field ].filtercond);
    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {

        this.selectedCollaborateur = new Collaborateur(collaborateur);
        this.selectedEmployeeOriginalValue = new Collaborateur(collaborateur);
        this.FieldsFiches = this.FieldsFichesVisu;

        // Last mission
        this.lastMission = null;
        this.selectedCollaborateur.missions.forEach(missionCollab => {
            var lastDate = (this.lastMission!=null && typeof this.lastMission['dateDebutMission'] == "string") ? this.lastMission['dateDebutMission'] : null;
            if (this.getDateIfMoreRecent( missionCollab['dateDebutMission'], lastDate ))
                this.lastMission = missionCollab;
        });

        // S/T = Non par défaut
        if (this.selectedCollaborateur.stt == "") this.selectedCollaborateur.stt="Non";
        // Préembauche = Non par défaut
        if (this.selectedCollaborateur.preEmbauche == "") this.selectedCollaborateur.preEmbauche="Non";
        // Indicate field preEmbauche obligatory (if preEmbauche selected)
        this.preEmbaucheChange(null);


        this.afficherLaSaisie();

        // Buttons
        this.buttons["Save"].disabled   = false;
        this.buttons["Create"].disabled = false;
        this.buttons["Prestas"].disabled = (this.selectedCollaborateur.prestations==null || this.selectedCollaborateur.prestations.length==0) ? true : false;
        this.buttons["EndMission"].disabled = (this.lastMission) ? (this.lastMission.statutMission=="T") ? true : false : true;
        this.buttons["Delete"].disabled     = (this.lastMission) ? true : false;
        this.buttons["ReOpen"].disabled = true;
        this.buttons["Cancel"].disabled = false;

    }

    getDateIfMoreRecent(datestr, lastDate ) {

        var dateArr = datestr.split("/"); //dd/mm/yyyy
        var dateTst = new Date(dateArr[2], dateArr[1], dateArr[0]);

        if (lastDate) dateArr = lastDate.split("/");
        var dateLast = (lastDate) ? new Date(dateArr[2], dateArr[1], dateArr[0]) : new Date(0);

        return ( dateTst > dateLast ) ? dateTst : null;
    }

    afficherLaSaisie() { this.displayDialog = true; }

    buttonsFunctions(btn:string) {
        this.buttons[btn].fnc.call();
    }

    updatelist(action, item) {

        var rowval = new Collaborateur(item);
        rowval.dateEmbaucheOpen = this.communServ.dateStr(rowval.dateEmbaucheOpen);

        if (action == "add") {

            this.collaborateurs.push(rowval);
            this.collaborateurs.sort(this.orderTrigrammeVersion);
            this.updateFilters();

        }
        else if (action=="change") {

            this.collaborateurs.forEach(function (row, index, array) {
                if (row.trigramme == item.trigramme) {
                    array[index] = rowval;
                    return;
                }
            });
        }
    }

    new() {

        this.selectedCollaborateur = new Collaborateur();
        // S/T = Non par défaut
        this.selectedCollaborateur.stt = "Non";
        // Préembauche = Non par défaut
        this.selectedCollaborateur.preEmbauche="Non";

        this.lastMission = new Mission();

        // Buttons
        this.buttons["Save"].disabled=false;
        this.buttons["Create"].disabled=true;
        this.buttons["Prestas"].disabled=true;
        this.buttons["EndMission"].disabled=true;
        this.buttons["Delete"].disabled=true;
        this.buttons["ReOpen"].disabled=true;
        this.buttons["Cancel"].disabled=false;
        this.FieldsFiches = this.FieldsFichesCreation;

        this.afficherLaSaisie();
    }

    save() {

        // CHECK input
        var errmsg="";
        if (this.selectedCollaborateur.categorisation=="")
            errmsg += "- Veuillez sélectionner une catégorie. ";
        else if (this.selectedCollaborateur.stt=="Oui" && this.selectedCollaborateur.societeStt=="" )
            errmsg += "- Le nom de la société STT est obligatoire. ";
        else if (this.selectedCollaborateur.stt=="Oui" && this.selectedCollaborateur.preEmbauche=="Oui" && !(this.selectedCollaborateur.dateEmbaucheOpen>0) )
            errmsg += "- La date d'embauche est obligatoire. ";

        if (errmsg=="") {
            // Save
            var collabfordb = new Collaborateur( this.selectedCollaborateur ) ;
            collabfordb.dateEmbaucheOpen = this.communServ.dateStr( this.selectedCollaborateur.dateEmbaucheOpen );

            // ADD
            if (collabfordb.id == 0) {
                collabfordb.statutCollab="E"; collabfordb.versionCollab=1;
                this.add(collabfordb);
            }
            // UPDATE
            else {
                this.update("E");
            }
        }
        else {
            this.alertService.error(errmsg);
        }
    }

    cancelEditCollab() {
        if (this.selectedCollaborateur.id == 0) this.new();
        else this.selectCollaborateur(null, this.selectedEmployeeOriginalValue);
    }

    // Indicat field dateEmbauche obligatory or not (depends on preEmbauche)
    preEmbaucheChange(event) {
        this.FieldsFiches.forEach(grp => {
            if (grp.grp == "ST") {
                grp.fields.forEach(fld => {
                    if  (fld.name == "dateEmbaucheOpen")
                        fld.obligatoire = (this.selectedCollaborateur["preEmbauche"]=="Oui") ? this.styleObligatoire : "";
                });
            }
        });
    }

    add (collabfordb) {

        this.communServ.setTimeStamp(collabfordb);
        // Check if not already in db
        this.collaborateurService.findByTrigramme(collabfordb.trigramme).pipe(first()).subscribe(data => {

                if (data == null) {
                    this.collaborateurService.create(collabfordb).pipe(first()).subscribe(data => {

                        // Update collab on success
                        this.updateCollabVar(this.selectedCollaborateur, data);

                        // Manage Buttons
                        this.buttons["Create"].disabled = false;
                        this.buttons["Prestas"].disabled = false;
                        this.buttons["EndMission"].disabled = false;
                        this.buttons["Delete"].disabled = false;

                        // Update list
                        this.updatelist("add", this.selectedCollaborateur);

                        // Actual value becomes original value
                        this.selectedEmployeeOriginalValue = new Collaborateur(this.selectedCollaborateur);

                        this.alertService.success("Enregistré");
                    },
                    error => {
                        this.alertService.error(error);
                    });
                }
                else
                    this.alertService.error("Un collaborateur avec trigramme "+ collabfordb.trigramme+ " existe déjà.");
        },
            error => { this.alertService.error(error); }
        );


    }

    update(action) {

        // Old value
        var collabfordbold = new Collaborateur (this.selectedEmployeeOriginalValue);
        collabfordbold.trigramme += "." + collabfordbold.versionCollab;
        collabfordbold.statutCollab = "A";
        collabfordbold.dateEmbaucheOpen = this.communServ.dateStr( collabfordbold.dateEmbaucheOpen );
        collabfordbold.missions = []; // Don't save the missions
        collabfordbold.prestations = []; // Don't save the prestations

        // New value
        var collabfordbnew = new Collaborateur( this.selectedCollaborateur) ;
        collabfordbnew.statutCollab = action; // S / E
        collabfordbnew.versionCollab = Number(collabfordbnew.versionCollab) + 1;
        collabfordbnew.dateEmbaucheOpen = this.communServ.dateStr( collabfordbnew.dateEmbaucheOpen );
        collabfordbnew.missions = []; // Don't save the missions
        collabfordbnew.prestations = []; // Don't save the prestations

        var collabfordbupd = collabfordbold; //collabfordbnew;
        var collabupd = this.selectedEmployeeOriginalValue; //this.selectedCollaborateur;

        var collabfordbadd = collabfordbnew; // collabfordbold;
        var collabadd = this.selectedCollaborateur; // this.selectedEmployeeOriginalValue;

        // this.communServ.setTimeStamp(collabfordbupd );
        // UPDATE
        this.collaborateurService.update(collabfordbupd).pipe(first()).subscribe(data => {

            // Update collab on success
            this.updateCollabVar(collabupd, data );

            // Update list
            this.updatelist("change", collabupd);

            this.alertService.success("Enregistré");

            // this.communServ.setTimeStamp(collabfordbadd);
            // ADD
            collabfordbadd.id = 0;
            this.collaborateurService.create(collabfordbadd).pipe(first()).subscribe(data => {

                // Update collab on success
                this.updateCollabVar(collabadd, data );

                // Update list
                this.updatelist("add", data);


                // Manage Buttons
                if (action=="S") {
                    this.buttons["EndMission"].disabled = true;  this.buttons["Delete"].disabled = true;
                }
                else {
                    this.buttons["EndMission"].disabled = false; this.buttons["Delete"].disabled = false;
                }

                // Actual value becomes original value
                this.selectedEmployeeOriginalValue = new Collaborateur(this.selectedCollaborateur);
            },
            error => { this.alertService.error(error);  }
            );
        },
        error => { this.alertService.error(error);  }
        );

    }

    newPrestation() { }
    endMission() { }

    suppCollab() {

        this.update("S");

        /*this.collaborateurService.delete(this.selectedCollaborateur.id)
            .pipe(first())
            .subscribe(
                data => {
                    this.selectedCollaborateur= new Collaborateur();
                },
                error => { this.alertService.error(error);  });
        */
    }

    updateCollabVar(myvar, data ) {
        myvar.id = data.id;
        myvar.statutCollab  = data.statutCollab;
        myvar.versionCollab = data.versionCollab;
        myvar.createdBy = data.createdBy; myvar.createdAt = data.createdAt;
        myvar.updatedBy = data.updatedBy; myvar.updatedAt = data.updatedAt;
    }


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
