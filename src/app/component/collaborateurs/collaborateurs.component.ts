import {Component, HostListener, OnInit, ViewChild, ɵQueryValueType} from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CategorieService, CollaborateurService, MissionService} from '../../service/datas.service';
import {Collaborateur, Mission, Prestation} from '../../model/referentiel';
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {ApiResponse} from "../../model/apiresponse";
import {PrestationsComponent} from "../prestations/prestations.component";
import {DataTable} from "primeng/primeng";
import {CommunATGService} from "../../service/communATG.service"
import {ConfirmationService} from "primeng/api";

interface OuiNon { label: string, value: string}

@Component({
    selector: 'app-collaborateurs',
    templateUrl: './collaborateurs.component.html',
    styleUrls: ['./collaborateurs.component.css'],
    providers : [ConfirmationService]
})
export class CollaborateursComponent implements OnInit {

    title : string = "Collaborateur";

    @ViewChild(('dt'))
    dt: DataTable;

    // Liste
    collaborateurs  : Collaborateur[] = [];
    cols            : any[];
    selectedColumns : any[];
    colDefs         : {}; // { header: string, field: any, filtertype: string, filtercond: string, showInList:boolean, selected, values, keys }[];
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

    ouinonComboOptions : OuiNon[] = [{value: "Oui", label: "Oui"}, {value: "Non", label: "Non"} ];

    private msgs    : Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private columns : any;
    private apiresponse : ApiResponse;


    // PRESTATIONS
    showPrestas : string = "none";
    componentRef: any;
    @ViewChild(PrestationsComponent)
    private prestasComponent    : PrestationsComponent ;
    private lastPrestation      : Prestation;
    private currentPrestation   : Prestation;

    // Dynamic prestas component : @ViewChild(AdDirective) adHost: AdDirective;
    buttonPrestationsLabels : String[] = ["Visualiser les prestations", "Visualiser les prestations"]; idxBtnPrestations : number =0;
    buttonsList    : String[] = ["Save","Create","Prestas","EndMission","Delete", "ReOpen", "Cancel"];
    buttons        : Object;

    FieldsFiches        : any[];
    FieldsFichesVisu    : any[];
    FieldsFichesCreation: any[];
    dateFields          : string[] = ["dateEmbaucheOpen"];

    communServ : CommunATGService;
    styleObligatoire : string = "obligatoire"; // : object = {'border-bottom':'lightsteelblue solid thin'};
    styleReadOnly    : string = "readonly"; // : object = {'border-bottom':'lightsteelblue solid thin'};
    //styleNormal : string = "";

    showDerogation : boolean = true;
    displayInfo = false;
    errMsg = "";

    constructor(private collaborateurService: CollaborateurService, private categorieService: CategorieService, private missionService: MissionService,
                private router: Router, private alertService: AlertService, private communATGService : CommunATGService, private confirmationService : ConfirmationService) {

        communATGService.updateCollabCompleted$.subscribe(x => this.onUpdateComplete(x));
        communATGService.updateMissionCompleted$.subscribe(x => this.onUpdateMissionCompleted(x));
        missionService.missionAdded$.subscribe(x => this.onMissionAdded(x));
        communATGService.error$.subscribe(x => this.errmsg(x) );

    }

    /*   ngOnChanges(): void { }*/
    errmsg(x) {
        this.errMsg += x +"\n";
        this.displayInfo = true;
    }

    ngOnInit() {

        this.communServ = this.communATGService;

        this.displayDialog2 = false;

        const camelCase = require('camelcase');

        this.colDefs = {
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
            statutMissionLabel: {header:"Statut",            filtertype : "",       filtercond:"", selected: [], values: [], keys: {}, showInList:false, keycol:false},
            versionMission:  {header:"Version",              filtertype : "",       filtercond:"", selected: [], values: [], keys: {}, showInList:false, keycol:false}
            //{header: 'created_at', field: camelCase('created_at')},
            //{header: 'created_by', field: camelCase('created_by')},
            //{header: 'updated_at', field: camelCase('updated_at')},
            //{header: 'updated_by', field: camelCase('updated_by')}
        };

        this.selectColumns();

        this.allStatusComboOptions = this.communServ.filterSelectItems(this.allstatus, this.allstatus );

        this.FieldsFichesVisu = [
            {grp: "Collab",     grplabel : "Informations collaborateur",    fields : [
                {name:"trigramme",        type:"field", obligatoire:"", readonly:true},                       {name:"nom",         type:"field", obligatoire:"", readonly:false}, {name:"prenom",      type:"field",    obligatoire:"", readonly:false},
                {name:"categorisation",   type:"combo", obligatoire:this.styleObligatoire, readonly:false},   {name:"stt",         type:"combo", obligatoire:"", readonly:false}]},
            {grp: "Mission",    grplabel : "Informations Mission",          fields : [
                {name:"dateDebutMission", type:"date",  obligatoire:"", readonly:true},                       {name:"dateA3Ans",   type:"date",  obligatoire:"", readonly:true},  {name:"dateFinSg",   type:"date",     obligatoire:"", readonly:true},
                {name:"derogation",       type:"combo", obligatoire:"", readonly:false, options:this.ouinonComboOptions},
                {name:"statutMissionLabel",type:"field", obligatoire:"", readonly:true, options:this.allStatusComboOptions},   {name:"versionMission",   type:"field", obligatoire:"", readonly:true} ]},
            {grp: "ST",         grplabel : "Informations Sous-Traitance",   fields : [
                {name:"societeStt",       type:"field", obligatoire:this.styleObligatoire, readonly:false},   {name:"preEmbauche", type:"combo", obligatoire:"", readonly:false}, {name:"dateEmbaucheOpen", type:"date",obligatoire:"", readonly:false}]},
            {grp: "Contact",    grplabel : "Informations de contact",       fields : [
                {name:"telPerso",         type:"field", obligatoire:"", readonly:false},                      {name:"telPro",      type:"field", obligatoire:"", readonly:false}, {name:"mailOpen",    type:"field",    obligatoire:"", readonly:false},
                {name:"mailSg",           type:"field", obligatoire:"", readonly:false}]}
        ];

        this.FieldsFichesCreation = [
            {grp: "Collab",     grplabel : "Informations collaborateur",    fields : [
                {name:"trigramme",        type:"field", obligatoire:"", readonly:false},                      {name:"nom",         type:"field", obligatoire:"", readonly:false}, {name:"prenom",      type:"field",    obligatoire:"", readonly:false},
                {name:"categorisation",   type:"combo", obligatoire:this.styleObligatoire, readonly:false},               {name:"stt",             type:"combo", obligatoire:"", readonly:false}]},
            {grp: "Mission",    grplabel : "Informations Mission",          fields : [
                {name:"dateDebutMission", type:"date",  obligatoire:"", readonly:true},                       {name:"dateA3Ans",   type:"date",  obligatoire:"", readonly:true},  {name:"dateFinSg",   type:"date",     obligatoire:"", readonly:true},
                {name:"derogation",       type:"combo", obligatoire:"", readonly:false, options:this.ouinonComboOptions} ]},
            {grp: "ST",         grplabel : "Informations Sous-Traitance",   fields : [
                {name:"societeStt",       type:"field", obligatoire:this.styleObligatoire, readonly:false},   {name:"preEmbauche", type:"combo", obligatoire:"", readonly:false}, {name:"dateEmbaucheOpen", type:"date",obligatoire:"", readonly:false}]},
            {grp: "Contact",    grplabel : "Informations de contact",       fields : [
                {name:"telPerso",         type:"field", obligatoire:"", readonly:false},                      {name:"telPro",      type:"field", obligatoire:"", readonly:false}, {name:"mailOpen",    type:"field",    obligatoire:"", readonly:false},
                {name:"mailSg",           type:"field", obligatoire:"", readonly:false}]}
        ];

        this.FieldsFiches = this.communServ.copyObj(this.FieldsFichesVisu);

        this.buttons = {
            "Save"      : {label:"Enregistrer",                 disabled:true,  fnc : ()=>{this.save();} },
            "Create"    : {label:"Créer une prestation",        disabled:true,  fnc : ()=>{this.createPrestation();} },
            "Prestas"   : {label:this.buttonPrestationsLabels[0],disabled:false,fnc : ()=>{this.showPrestations();} },
            "EndMission": {label:"Terminer la mission",         disabled:true,  fnc : ()=>{this.endMission();} },
            "Delete"    : {label:"Supprimer le collaborateur",  disabled:true,  fnc : ()=>{this.suppCollab();} },
            "ReOpen"    : {label:"Réactiver le collaborateur",  disabled:true,  fnc : ()=>{this.save();} },
            "Cancel"    : {label:"Annuler",                     disabled:true,  fnc : ()=>{this.cancelEditCollab();} }
        };

        this.loadAllCollaborateurs();

        this.loadCategorisations();
        // this.colsplice = this.selectedColumns; this.colsplice.splice(1,10);
        // Prestations (dynamique) : this.loadPrestationComponent();
    }

    selectColumns() {

        this.selectedColumns = this.communServ.filterTableSelectItems(this.colDefs, 'showInList', 'header');
        this.cols = this.selectedColumns;
    }

    loadAllCollaborateurs() {

        this.collaborateurService.list().subscribe(collaborateurs => { console.log("Collaborateurs chargés");
            this.collaborateurs = this.communServ.updateFilters( collaborateurs, this.orderTrigrammeVersion, this.colDefs, "statutCollab", this.allstatus );
            this.showHistSelect = false;
        },error => { this.errmsg(error); } );
    }

    loadCategorisations() {

        this.references["categorisations"] = [];

        var flds = [{ref:"categorisations", key:"categorisation", label:"categorisation", labelbis:"libelle"}] ;

        this.communServ.loadTableKeyValues(flds, this.categorieService, this.references, null, true );
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
        var value = this.colDefs[ field ].selected;
        //if (this.filtres[ field ].filtertype == "date")
        //    value = this.datePipe.transform(value, 'yyyy-MM-dd');
        this.dt.filter(value, field, this.colDefs[ field ].filtercond);
    }

    manageFieldsFiche(action, state) {

        // Copie template definition
        var fieldsFiches : any[] = (action == "Visu") ? this.FieldsFichesVisu : this.FieldsFichesCreation;
        fieldsFiches = this.communServ.copyObj(fieldsFiches);

        // Make fields readonly if state "Terminée"
        if (state == "T")
            fieldsFiches = this.communServ.setSubArrayProperty(fieldsFiches, "","fields", "","readonly", true);
        else // Enable/disable change of dateFinSG depending on mission derogation oui/non
            this.refreshDerogationInput();

        return fieldsFiches ;
    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {

        this.selectedCollaborateur          = new Collaborateur(collaborateur);
        this.selectedEmployeeOriginalValue  = new Collaborateur(collaborateur);

        // Get last mission
        this.missionService.getMissionsCollab( this.selectedCollaborateur.trigramme).pipe(first()).subscribe(data => {

            this.selectedCollaborateur.missions = data;
            // Change type of dates stocked as string into date
            this.selectedCollaborateur.missions.map(mission => {
                this.communServ.datePropsToDate(mission, ["dateDebutMission", "dateFinSg", "dateA3Ans"]);
            });
            this.lastMission = this.communServ.getLastItem( this.selectedCollaborateur.missions, 'dateDebutMission', 'versionMission');
            if (this.lastMission) this.lastMission["statutMissionLabel"] = this.allstatus[this.lastMission.statutMission];

            // Refresh screen elements depending on mission
            // Enable/disable change of dateFinSG depending on mission derogation oui/non
            this.refreshDerogationInput();
            // Buttons depending on mission :
            this.afficherLaSaisie("Visu");

        },error => { this.errmsg(error); } );


        // S/T = Non par défaut
        if (this.selectedCollaborateur.stt == "") this.selectedCollaborateur.stt="Non";
        // Préembauche = Non par défaut
        if (this.selectedCollaborateur.preEmbauche == "") this.selectedCollaborateur.preEmbauche="Non";
        // Indicate field preEmbauche obligatory (if preEmbauche selected)
        this.preEmbaucheChange(null);

    }


    getStatutCollab(statutCollab, lastMission) {
        var statutMission = (lastMission) ? lastMission.statutMission : "";
        var activeCollab  = (statutCollab == "E");
        return { statutCollab : statutCollab,
                 hasMission : (statutMission!="" && statutMission!="T"),
                 hasHadMission : (lastMission) ? (statutMission!="") ? true : false : false,
                 activeCollab : activeCollab,
                 activeOrNew: activeCollab || (statutCollab == "") }
    }

    canDelete(collab) {

        // Si pas en cours : Non
        if (collab.statutCollab != "E")
            return false;

        // S'il n'a pas (eu) une mission
        var lastMission = this.communServ.getLastItem( collab.missions, 'dateDebutMission', 'versionMission' );
        var statutCollab = this.getStatutCollab( collab.statutCollab, lastMission );
        return !statutCollab.hasHadMission;
    }

    afficherLaSaisie(action) {

        this.displayDialog = true;

        var statutCollab = this.getStatutCollab(this.selectedCollaborateur.statutCollab, this.lastMission);

        this.FieldsFiches = this.manageFieldsFiche(action, this.selectedCollaborateur.statutCollab );

        // Buttons
        this.communServ.setObjectValues(this.buttons, "disabled",{
            Save        : !statutCollab.activeOrNew,                                    // Ne pas Enregistrer si : collab Pas Actif ou Nouveau
            Create      : !statutCollab.activeCollab || !statutCollab.hasMission,       // Ne pas Créer prestation si : collab pas actif ou pas mission en cours
                                                                                        // Ne pas Voir Prestas si : il y en a pas
            Prestas     : (this.selectedCollaborateur.prestations == null || this.selectedCollaborateur.prestations.length == 0),
            EndMission  : !statutCollab.activeCollab || !statutCollab.hasMission,       // Ne pas mettre Fin à la mission si : collab pas actif ou pas mission en cours
            Delete      : statutCollab.hasHadMission || !statutCollab.activeCollab,     // Ne pas Supprimer le collab si : il a (eu) une mission ou pas actif (E / donc pas T, A ou déjà S)
            ReOpen      : statutCollab.activeOrNew,                                     // Ne pas Réactiver si : Actif ou Nouveau
            Cancel      : false } );
    }

    new() {

        // Create empty item
        this.selectedCollaborateur = new Collaborateur();

        // Set default values : S/T = Non, Préembauche = Non
        this.communServ.setObjectValues(this.selectedCollaborateur, null,{stt:"Non", preEmbauche: "Non"});

        this.lastMission = null;

        // Show form
        this.displayDialog = true;
        this.afficherLaSaisie("New");
    }

    checkInput(item) {
        var errmsg="";
        if (item.categorisation == "")
            errmsg += "- Veuillez sélectionner une catégorie. ";
        else if (item.stt == "Oui" && item.societeStt == "" )
            errmsg += "- Le nom de la société STT est obligatoire. ";
        else if (item.stt == "Oui" && item.preEmbauche == "Oui" && !(item["dateEmbaucheOpen"] > 0) )
            errmsg += "- La date d'embauche est obligatoire. ";
        return errmsg;
    }

    save() {

        var item = this.selectedCollaborateur;

        // CHECK input
        let errMsg = this.checkInput(item);
        if (errMsg == "") {

            // ADD new value
            if (item.id == 0) {
                var newItem = new Collaborateur(item);
                this.communServ.setObjectValues(newItem, null, {
                    // Set State to "En cours" Version "1"
                    statutCollab : "E", versionCollab : 1,
                    missions : [], prestations : []}); // Don't save the missions neither prestations automatically
                this.communServ.datePropsToStr(newItem, this.dateFields );

                this.add(newItem);
            }

            // UPDATE
            else {

                this.update("E");

                // Update last mission
                if (this.lastMission != null)
                    this.missionService.update(this.lastMission).pipe(first()).subscribe(data => {  },error => { this.errmsg(error); } );
            }
        }
        else this.errmsg(errMsg);
    }

    cancelEditCollab() {
        if (this.selectedCollaborateur.id == 0)
            this.new();
        else
            this.selectCollaborateur(null, this.selectedEmployeeOriginalValue);
    }

    // Indicate field dateEmbauche obligatory or not (depends on preEmbauche)
    preEmbaucheChange(event) {
        var obl = (this.selectedCollaborateur["preEmbauche"]=="Oui") ? this.styleObligatoire : "";
        this.FieldsFiches = this.communServ.setFieldValue(this.FieldsFiches, "ST", "dateEmbaucheOpen", "obligatoire", obl);
    }

    add (itemfordb) {

        // Check if not already in db
        this.collaborateurService.findByTrigramme(itemfordb.trigramme).pipe(first()).subscribe(data => {
            if (data == null) {

                this.communServ.setTimeStamp(itemfordb);
                this.collaborateurService.create(itemfordb).pipe(first()).subscribe(data => {

                    var item = this.selectedCollaborateur;

                    // Update collab (on successful creation)
                    this.communServ.updateVersion( "Collab", item, data);

                    // Update list
                    this["collaborateurs"] = this.updateCollabList("add", this["collaborateurs"], item );

                    // Actual value becomes original value
                    this.selectedEmployeeOriginalValue = item;

                    this.alertService.success("Collaborateur ajouté");
                    this.afficherLaSaisie("Visu");
                 }, error => { this.errmsg(error); });
            }
            else this.errmsg("Un collaborateur avec trigramme "+ itemfordb.trigramme+ " existe déjà.");
        }, error => { this.errmsg(error); } );
    }

    update(action) {

        // Old value : set Archived (change trigramme to trigramme_(version)
        var dbold = new Collaborateur (this.selectedEmployeeOriginalValue);
        this.communServ.setObjectValues(dbold, null, {trigramme : dbold["trigramme"] + "." + dbold.versionCollab, statutCollab: "A",
            missions : [], prestations : []}); // Don't save the missions neither prestations automatically
        this.communServ.datePropsToStr(dbold, this.dateFields );

        // New value : statut : Action, version++
        var dbnew = new Collaborateur( this.selectedCollaborateur );
        this.communServ.setObjectValues(dbnew, null, {statutCollab : action, // S / E / T
            versionCollab : Number(dbnew.versionCollab) + 1,
            missions : [], prestations : []}); // ,,
        this.communServ.datePropsToStr(dbnew, this.dateFields );

        //var dbupd  = dbold; var upd  = this.selectedEmployeeOriginalValue;
        //var dbadd  = dbnew; var add  = this.selectedCollaborateur;
        var dbupd = dbnew; var upd = this.selectedCollaborateur;
        var dbadd = dbold; var add = this.selectedEmployeeOriginalValue;
        this.communServ.updateWithBackup("Collab", upd, dbupd, add, dbadd, this.collaborateurService, false);
    }


    // Actual value becomes original value, refresh form
    onUpdateComplete(success) {
        console.log("Collaborateurs - onUpdateComplete triggered");

        this.alertService.success("Enregistré");

        // Update list with new and archived values
        let list = "collaborateurs";
        this[list] = this.updateCollabList("change", this[list], this.selectedCollaborateur );
        this[list] = this.updateCollabList("add",    this[list], this.selectedEmployeeOriginalValue );

        // New value becomes last value
        this.selectedEmployeeOriginalValue = new Collaborateur( this.selectedCollaborateur );

        // Refresh screen
        this.afficherLaSaisie("Visu");
    }

    // MISSION, Todo : place this function in 'MissionComponent'
/*    updateMission(entity: string, action : string, item : Mission, dbService : MissionService, clear : boolean = false) {

        if (item==undefined || item==null) return;

        // Old value
        var dbold = new Mission(item); this.communServ.setObjectValues(dbold, null, { statutMission : "A"} );
        // New value
        var dbnew = new Mission(item); this.communServ.setObjectValues(dbnew, null, { statutMission : action,  // "T"
            versionMission : Number(dbnew.versionMission) + 1 });

        var dbupd  = dbold; var upd = new Mission(item);
        var dbadd  = dbnew; var add = item; // Keep last value in memory
        // Save & Clear value
        this.communServ.updateWithBackup(entity, upd, dbupd, add, dbadd, dbService, clear);
    }
*/

    onUpdateMissionCompleted( param: Mission ) {  this.onMissionChange(param, "update"); }
    onMissionAdded(param : Mission) { this.onMissionChange(param, "add"); }

    onMissionChange(param:Mission, change:string) {

        console.log("Collaborateurs - onMissionChange triggered - " + change );

        this.lastMission = param;
        if (this.lastMission) this.lastMission["statutMissionLabel"] = this.allstatus[this.lastMission.statutMission];

        if (param==null) return;

        // Update missions list of collab
        if (change=="update")
            this.communServ.updatelist( this.selectedCollaborateur.missions, "change", param, new Mission(param),   null,null, null,null);
        else { // add
            // Update missions list of collab (add)
            if (!Array.isArray(this.selectedCollaborateur.missions))
                this.selectedCollaborateur.missions = [];
            this.selectedCollaborateur.missions.push(param);
        }

        // Enable/disable change of dateFinSG depending on mission derogation oui/non
        this.refreshDerogationInput();

        // If terminated hide it
        if (this.lastMission["statutMission"] == 'T')
            this.lastMission = null;

    }


    refreshDerogationInput() {

        let readonly = (this.lastMission && this.lastMission.derogation=="Oui") ? false : true;
        this.FieldsFiches = this.communServ.setSubArrayProperty(this.FieldsFiches,"Mission","fields","dateFinSg","readonly", readonly);
    }

    // On combo change
    changeDerogation(event) {

        // Check if not a running prestation exceeding 3 years
        let valueChanged = 1;
        if (event.value=="Non") {
            var hasDateExceeding3Years = false;
            var debutMission = this.communServ.convertStrToDate(this.lastMission.dateDebutMission);
            var date3ans = this.communServ.addToDate( debutMission, [0,0,3] )
            this.selectedCollaborateur.prestations.forEach(prestation => {
                if ( prestation.identifiantMission == this.lastMission.identifiantMission) {
                    if ( prestation.dateFinPrestation > date3ans )
                        hasDateExceeding3Years = true;
                }
            });
            if (hasDateExceeding3Years) {

                this.lastMission.derogation="Oui";

                this.errmsg("La dérogation ne peut être annulée du à la présence de prestations dépassant la période autorisée.");

                // Refresh screen
                this.showDerogation=false;
                setTimeout(()=>this.showDerogation=true, 0);
                valueChanged = 0;
            }

        }
        if (valueChanged == 1)
            this.refreshDerogationInput();

    }

    createPrestation() { }

    // Terminate mission
    endMission() {

        this.confirmationService.confirm({

            message: "Terminer la mission mettra fin à la prestation en cours et à l'activité du collaborateur. Confirmez-vous cette action ?", accept: () => {

                // Updates :

                // - Mission & - Prestation
                if (this.lastMission) {

                    // - Mission
                    // !! as clear is set the lastmision will be cleared (
                    this.missionService.updateMission("Mission", "T", this.lastMission, this.missionService, true);

                    // - Last Prestation of Mission
                    let prestationsMission = this.communServ.getItemsCond( this.selectedCollaborateur.prestations, 'identifiantMission', this.lastMission.identifiantMission );
                    this.currentPrestation = this.communServ.getLastItem( prestationsMission, 'dateDebutPrestation', 'versionPrestation' );
                    if ( this.currentPrestation != undefined && this.currentPrestation != null ) {
                        this.lastPrestation = new Prestation(this.currentPrestation); // Last value = current value archived
                        this.prestasComponent.updatePrestation("Prestation", "T", this.currentPrestation, this.lastPrestation, this.prestasComponent.updatePrestationCompleted );
                    }
                }

                // - Collaborateur && Refresh screen
                this.update("T");
            }
        });
    }

    onUpdatePrestationCompleted(param) {

        console.log("Collaborateurs - onUpdatePrestationCompleted triggered");
        // Update list with new and archived values
        let list = "prestations"; let prop = "selectedCollaborateur";
        // as currentPrestation has become new (add) value by prestasComponent.updatePrestation
        // and list updated with this new value, add only old value :
        this[prop][list] = this.updatePrestasList("add", this[prop][list], this.lastPrestation       );
        //this[prop][list] = this.updatePrestasList("add",    this[prop][list], this.currentPrestation    );
   }

    updatePrestasList(action, list, value) {
        return this.communServ.updatelist( list, action, value, new Prestation(value),   null,null, null,null);
    }

    updateCollabList(action, list, value) {
        return this.communServ.updatelist( list, action, value, new Collaborateur(value), this.colDefs,"statutCollab", this.orderTrigrammeVersion, this.allstatus);
    }

    suppCollab(item=null) {

        // Check if can be deleted (see canDelete()) : not necessary because btns already disables

        // Delete (after confirmation)
        this.confirmationService.confirm({
            message: "Confirmez-vous la suppression ?",
            accept: () => {

                if (item)
                    this.selectCollaborateur(null, item);

                this.update("S");

                /*this.collaborateurService.delete(this.selectedCollaborateur.id).pipe(first()).subscribe( data => {
                            this.selectedCollaborateur = new Collaborateur();
                  }, error => { this.alertService.error(error); });   */
            }
        });
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
        // Update prestas screen because prestas & missions lists can have be changed by programme so updating & sorting required
        this.prestasComponent.showCollab(this.selectedCollaborateur);

        // Dynamic way :
        //(<PrestationsComponent>this.componentRef.instance).collab = this.selectedCollaborateur;
        //(<PrestationsComponent>this.componentRef.instance).id = this.selectedCollaborateur.trigOpen;
        //(<PrestationsComponent>this.componentRef.instance).showCollab(); //ngOnInit();
        //(<PrestationsComponent>this.componentRef.instance).selectPrestations(this.selectedCollaborateur.prestations);
    }

    onClosewindowPrestas() {

        // In case change of prestations, retrieve them
        this.selectedCollaborateur.prestations = this.prestasComponent.prestations;

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
