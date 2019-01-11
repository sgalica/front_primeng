import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, CommercialOpen, Contrat, Mission, Prestation} from "../../model/referentiel";
import {CommercialOpenService, ContratService, DonneurOrdreService, EquipeService, NumAtgService, PrestationService, SiteService, MissionService} from "../../service/datas.service";
import {CommunATGService} from "../../service/communATG.service";
import {ConfirmationService} from "primeng/api";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../service/auth.service";

//this.prestations=this.communServ.updatelist(this.prestations, action, item, new Prestation(item), this.coldefs, "statutPrestation", ["dateDebutPrestation","dateFinPrestation"], this.orderDateDebutEtVersion, this.allstatus);

@Component({ selector: 'app-prestations', templateUrl: './prestations.component.html', styleUrls: ['./prestations.component.css' ],
    providers : [ConfirmationService] })
export class PrestationsComponent implements OnInit, OnChanges {

    title : string = "Prestation";

    @Input()  collab : Collaborateur;
    @Output() closewindowPrestas        = new EventEmitter<boolean>();
    @Output() updatePrestationCompleted = new EventEmitter<boolean>();

    @ViewChild(('pt'))
    pt: DataTable;

    modeCollab : boolean = false;


    // Liste
    prestations : Prestation[] = [];
    cols        : any[];
    selectedColumns: any[];
    colDefs     : {}; //{ header: string, field: string, filtertype: string, filtercond: string, selected:[]/"" showInList: boolean }[];

    // Collaborateur
    id: string;
    employee_name: string = "";

    // Fiche/Detail
    selectedPrestation  : Prestation = new Prestation();
    selectedPrestationOriginalValue : Prestation;
    displayDialogPresta : boolean = false;

    // Références
    missions    : { label: string, value: number }[];
    allstatus = { E : "En cours", T: "Terminée", S: "Supprimée", A: "Archivée" };
    contrats    : SelectItem[]=[];
    references  : any[]=[];
    localisationMap : object = null;

    showHistSelect : boolean = false;

    buttonsList : String[] = ["Save", "End", "Delete", "Cancel", "ReOpen"];
    buttons     : Object; // {label:String, disabled:Boolean}[] = []

    fieldsFiches        : any[];
    fieldsFichesDefault : any[];
    dateFields          : string[] = ["dateDebutPrestation", "dateFinPrestation"];

    communServ       : CommunATGService;
    styleObligatoire : string = "obligatoire";
    styleReadOnly    : string = "readonly";

    callback : EventEmitter<boolean>;
    // Sorting
    //sortOptions: SelectItem[]; //sortField: string; sortOrder: number;
    //this.sortOptions = [ {label: 'Newest First', value: '!nom'}, {label: 'Oldest First', value: 'nom'}, {label: 'Brand', value: 'brand'}        ];
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
    isAdmin$ = new BehaviorSubject<boolean>(false); // {1}
    displayInfo = false;
    errMsg = "";


    constructor(

        private prestationService: PrestationService,

        private contratService: ContratService,
        private missionService : MissionService,
        private siteService: SiteService,
        private numAtgService: NumAtgService,
        private equipeService : EquipeService, // Departement, Pôle, Domaine, 
        private donneurOrdreService: DonneurOrdreService,
        private commercialOpenService: CommercialOpenService,
        // private respPoleService: Service,

        private router: Router, private route: ActivatedRoute,
        private alertService: AlertService,
        private communATGService : CommunATGService,
        private confirmationService : ConfirmationService,
        private authService : AuthService
    ) {
        communATGService.updatePrestationCompleted$.subscribe(x => this.onUpdatePrestationCompleted(x));
        missionService.missionAdded$.subscribe(x => this.onMissionAdded(x));
        communATGService.error$.subscribe(x => this.errmsg(x) );
    }

    errmsg(x) {
        this.errMsg += x +" - ";
        this.displayInfo = true;
    }

    ngOnInit() {

        this.communServ = this.communATGService;

        // Mode ALL prestations from service or COLLAB (Prestations from collab)
        if (this.route.snapshot.url[ 0 ].path != ("prestations"))
            this.modeCollab = true;
        this.prestations = [];
        this.communServ.setObjectValues(this.selectedPrestation, null,{
            collaborateur: new Collaborateur(), contrat: new Contrat(), commercialOpenInfo: new CommercialOpen()});

        // Columns
        // Cols depending on ID
        //this.col_list = ["trigramme", "dateDebutPrestation", "dateFinPrestation", "contratAppli", "numAtg", "departement", "pole", "domaine", "localisation", "numeroPu", "responsablePole", "donneurOrdre", "topAtg", "statutPrestation", "commercialOpen", "versionPrestation",
        //    "nom", "prenom", "dateDebutContrat", "dateFinContrat", "adresseMail", "telephonePortable", "telephoneFixe"];

        this.colDefs = {
            trigramme :             {header: 'Identifiant Pilote',  filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            dateDebutPrestation :   {header: 'Début',               filtertype: "date",  showInList:true,  filtercond: "gte", selected: "", values:"", keys:{}, keycol:false},
            dateFinPrestation :     {header: 'Fin',                 filtertype: "date",  showInList:true,  filtercond: "lte", selected: "", values:"", keys:{}, keycol:false},
            contratAppli :          {header: 'Contrat',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            numAtg:                 {header: 'ATG',                 filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            departement:            {header: 'Département',         filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            pole:                   {header: 'Pôle',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            domaine:                {header: 'Domaine',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            localisation:           {header: 'Site',                filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            localisationLib:        {header: 'Site',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            numeroPu:               {header: 'PU',                  filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            responsablePole:        {header: 'Responsable de pôle', filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            donneurOrdre:           {header: 'Donneur ordre SG',    filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            topAtg:                 {header: 'Type',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            statutPrestation:       {header: 'Statut',              filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            versionPrestation:      {header: 'Version',             filtertype: "",      showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            commercialOpen:         {header: 'Nom prénom',          filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            identifiantMission:     {header: 'Mission',             filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},

            // Collaborateur
            nom:                    {header: "Nom",                 filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            prenom:                 {header: "Prénom",              filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},

            // Contrat
            dateDebutContrat:       {header: "Date début",          filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            dateFinContrat:         {header: "Date fin",            filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},

            // Commercial Open
            adresseMail:            {header: "Mail",                filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            telephonePortable:      {header: "Tél. portable",       filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            telephoneFixe:          {header: "Tél. fixe",           filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:false}

            /* {header: 'date_c', field:'prestDateCreation'}, {header: 'user_c', field:'prestUserCreation'}, {header: 'date_m', field:'prestDateMaj'}, {header: 'user_m', field:'prestUserMaj'},   */
        };

        this.selectColumns();
        this.fieldsFiches = [
            {grp: "collaborateur",  grplabel : "Prestataire",
                fields :   [{name:"trigramme",      type:"field", obligatoire:"", readonly:true},                  {name:"nom",                 type:"field", obligatoire:"", readonly:true},                   {name:"prenom",             type:"field", obligatoire:"", readonly:true}]},
            {grp: "contrat",        grplabel : "Contrat",
                fields :   [{name:"contratAppli",   type:"combo", obligatoire:"", readonly:false, editable:false, fnc: ()=>{this.contratChanged();} }, {name:"dateDebutContrat",    type:"date",  obligatoire:"", readonly:true},                   {name:"dateFinContrat",     type:"date",  obligatoire:"", readonly:true}]},
            {grp: "Prestation",     grplabel : "Prestation",
                fields :   [{name:"localisation",   type:"combo", obligatoire:this.styleObligatoire, readonly:false, editable:false}, {name:"numAtg",              type:"combo", obligatoire:this.styleObligatoire, readonly:false, editable:false},
                            {name:"departement",    type:"combo", obligatoire:this.styleObligatoire, readonly:false, editable:false}, {name:"pole",                type:"combo", obligatoire:this.styleObligatoire, readonly:false, editable:false},  {name:"domaine",            type:"combo", obligatoire:this.styleObligatoire, readonly:false, editable:false},
                            {name:"numeroPu",       type:"field", obligatoire:this.styleObligatoire, readonly:false},                 {name:"dateDebutPrestation", type:"date",  obligatoire:this.styleObligatoire, readonly:false},                  {name:"dateFinPrestation",  type:"date",  obligatoire:"", readonly:false},
                            {name:"responsablePole",type:"combo", obligatoire:"", readonly:false, editable:true},
                            {name:"donneurOrdre",   type:"combo", obligatoire:"", readonly:false, editable:false},
                            {name:"identifiantMission",type:"combo", obligatoire:"", readonly:false, editable:false}]},
            {grp: "commercialOpenInfo", grplabel : "Commercial OPEN",
                fields :   [{name:"commercialOpen", type:"combo", obligatoire:"", readonly:false, editable:false, fnc: ()=>{this.commercialOpenChanged();} }, {name:"adresseMail",         type:"field", obligatoire:"", readonly:true},                   {name:"telephonePortable",  type:"field", obligatoire:"", readonly:true},      {name:"telephoneFixe", type:"field", obligatoire:"", readonly:true} ] }
        ];
        this.fieldsFichesDefault = this.communServ.copyObj(this.fieldsFiches);

        this.displayDialogPresta = false;

        this.buttons = {
            "Save"   : {label:"Enregistrer", disabled:true,  fnc : ()=>{this.save();} },
            "End"    : {label:"Terminer",    disabled:true,  fnc : ()=>{this.end();} },
            "Delete" : {label:"Supprimer",   disabled:false, fnc : ()=>{this.suppPrestation();} },
            "Cancel" : {label:"Annuler",     disabled:true,  fnc : ()=>{this.cancelEditPresta();} },
            "ReOpen" : {label:"Ré-ouvrir la prestation", disabled:true,  fnc : ()=>{this.save();} }
        };

        if (!this.modeCollab)
            this.loadAllPrestations();

        this.loadReferences();

        // Is admin ?
        if (localStorage.getItem('currentUser')) {
            this.authService.isAdmin.subscribe((value) => {
                this.isAdmin$.next(value);
            });
        }

    }

    showCollab(pCollab:Collaborateur) {

        this.errMsg = "";

        if (pCollab != null)
            this.collab = pCollab;

        // Name & id collab
        this.id             = this.collab.trigramme;
        this.employee_name  = this.collab.prenom + " " + this.collab.nom;
        // Prestations collab
        this.selectPrestations(this.collab.prestations);

        // Init combo missions with missions of Collab
        let list = [];
        list.push({label: " [Vide]", value: ""});
        if (this.collab.missions)
            this.collab.missions.forEach(mission => {
                list.push({label: mission.identifiantMission , value: mission.identifiantMission});
            });
        if (this.colDefs)
            this.colDefs["identifiantMission"].values = list;

    }

    selectColumns() {

        this.selectedColumns = this.communServ.filterTableSelectItems(this.colDefs, 'showInList', 'header');

        // Cols depend on all or collab prestations
        // Remove trigramme if mode collab
        // !((key == "trigramme") && (this.modeCollab) ) &&
        if (this.modeCollab) {
            var pos = 0;
            this.selectedColumns.forEach( colval => {
                if (colval.field == "trigramme")
                    this.selectedColumns.splice(pos, 1);
                else
                    pos++;
            });
        }

        this.cols = this.selectedColumns;
    }

    loadAllPrestations() {

        this.prestationService.list().subscribe(prestations => {
            this.selectPrestations(prestations);
            this.filterVersions();
            // RespsPole : If all prestations loaded, we can take values from filters
            var ref = "responsablePole";
            Array.prototype.push.apply(this.references[ref], this.colDefs[ref].values);
        },error => { this.errmsg(error); });
    }

    selectPrestations( p_prestations: Prestation[]) {

        if ( this.communServ != undefined ) {
            // Load localisation labels before showing table
            if (this.localisationMap == null) {
                this.localisationMap = {};
                this.siteService.list().pipe(first()).subscribe( rows => {
                    rows.forEach(row => {
                        this.localisationMap[row.codeSite] = row.libelleSite;
                    });
                    this.prestations = this.communServ.updateFilters(p_prestations, this.orderDateDebutEtVersion, this.colDefs, "statutPrestation", this.allstatus, this.dateFields, "collaborateur", this.localisationMap);
                });
            }
            else
                this.prestations = this.communServ.updateFilters(p_prestations, this.orderDateDebutEtVersion, this.colDefs, "statutPrestation", this.allstatus, this.dateFields, "collaborateur", this.localisationMap );
        }
        this.showHistSelect = false;
    }


    /*// Get collab info
    loadPrestationsCollab(idemployee) {
        this.employeeService.read(idemployee).pipe(first()).subscribe(p_employee => {
            this.showCollab(p_employee);
            this.filterVersions();
        });
    }*/
    // Tri sur datedebut (desc) et version (desc)
    orderDateDebutEtVersion(a, b) {
        var fld="dateDebutPrestation"; var fld2="versionPrestation";
        var retval = (a[fld] > b[fld]) ? -1 : (a[fld] < b[fld]) ? 1 : 0;
        return (retval!=0) ? retval : (a[fld2] > b[fld2]) ? -1 : (a[fld2] < b[fld2]) ? 1 : 0;
    }

    filterVersions() {
        // Si E T ou S pas d'historique, si affichage complète (E T et S) également affichage Historique si coché.

        var statushist: string[];

        // Multiselect
        var status: string[] = this.colDefs["statutPrestation"].selected; // this.selectedPrestas.status;

        /*// Combo : si pas de sélection : afficher tout
        status=[this.selectedPrestas.statut];
        if (this.selectedPrestas.statut=="") {
            status = ['E', 'T', 'S'];
            if (this.selectedPrestas.version != "") {
                //statushist=Array.from(status,x=>x+'A');
                //Array.prototype.push.apply(status, statushist);
                Array.prototype.push.apply(status, ['A']);
            }
        }*/

        this.pt.filter(status, 'statutPrestation', 'in');
    }

    pt_filter(event, pt, field: string) {
        var condition = {cond:this.colDefs[ field ].filtercond, value:this.colDefs[field].selected};
        if (this.colDefs[field].filtertype == "date")
            condition = this.communServ.convertDateGteLteToGtLt(condition);

        this.pt.filter(condition.value, field, condition.cond);
    }

    manageFieldsFiche(action, state) {

        // Copie template definition
        var fieldsFiches : any[] = this.communServ.copyObj(this.fieldsFichesDefault);

        // To do : evt  adapte if not same for fields with creation
        // var fieldsFiches : any[] = (action=="Visu") ? this.fieldsFichesVisu : this.fieldsFichesCreation;

        // Make all fields readonly if state "Terminée"
        if (state == "T")
            fieldsFiches = this.communServ.setSubArrayProperty(fieldsFiches, "", "fields", "", "readonly", true);

        return fieldsFiches;
    }

    selectPrestation(event: Event, prestation: Prestation) {

        this.selectedPrestation              = new Prestation(prestation);
        this.selectedPrestationOriginalValue = new Prestation(prestation);

        // Set collaborateur (we come from collaborateur so collab of prestation not loaded by hibernate)
        if (prestation.collaborateur == undefined)
            this.selectedPrestation.collaborateur = this.collab;

    }

    getStatut(statut) {
        var active  = (statut == "E");
        return { statut : statut,
                 active : active,
                 activeOrNew: active || (statut == "") }
    }

    canDelete(item) {

        // Si En cours
        return (item.statutCollab == "E") ;

        //var statut = this.getStatut(item.statutPrestation);
    }

    afficherLaSaisie(action) {

        this.displayDialogPresta = true;

        this.fieldsFiches = this.manageFieldsFiche(action, this.selectedPrestation.statutPrestation );

        // Buttons
        let statut = this.getStatut(this.selectedPrestation.statutPrestation);
        this.communServ.setObjectValues(this.buttons, "disabled",{
            Save        : !statut.activeOrNew,         // Ne pas Enregistrer si : pas (Actif ou Nouveau)
                                                       // On ne peut mettre fin à la prestation si :
                                                       //> pas statut En cours ||
                                                       //> la date de début n'est pas révolue (Une prestation non commencée ne peut pas être terminée. Elle pourra être supprimée.)
            End         : !statut.active || (new Date() < this.selectedPrestation.dateDebutPrestation),
            // On ne peut pas réactiver si : statut != 'T' ou collab!=actif ou user != admin
            ReOpen      : statut.statut != "T" || this.collab.statutCollab != "E" || !this.isAdmin$ ,
            Cancel      : false } );
    }

    new() {
        // Check if not already prestation running
        // S'il existe une prestation de statut "En cours" (donc une mission En cours), une nouvelle prestation ne peut-être créée.
        if (this.collab) {
            let actualPrestation = this.communServ.getArrayItemProp(this.collab.prestations, "statutPrestation", "E", null);
            if (actualPrestation) {
                this.errmsg("La création d'une prestation n'est pas possible parce qu'une prestation est encore en cours.");
            }
            else {

                // Create new prestation affected to collab and actual mission
                this.selectedPrestation = new Prestation();

                // Set default values :
                // - mission with active mission of collab
                // - collab info
                let actualMission  = this.communServ.getArrayItemProp( this.collab.missions,"statutMission", "E", null );
                let defaultMission = (actualMission) ? actualMission.identifiantMission : "";
                this.communServ.setObjectValues(this.selectedPrestation, null, {
                    trigramme    : this.collab.trigramme,
                    collaborateur: this.collab,
                    contrat      : new Contrat(),
                    commercialOpenInfo: new CommercialOpen(),
                    identifiantMission: defaultMission
                });

                // Show form
                this.displayDialogPresta = true;
                this.afficherLaSaisie("New");
            }
        }
    }

    checkInput(item : Prestation) {
        let errmsgs = [];
        let errmsg = "";
        let fieldsGrp = this.communServ.getArrayItemProp( this.fieldsFiches,"grp","Prestation","fields" );
        fieldsGrp.forEach( fld => {
            if ( fld.obligatoire != "") {
                if ( item[fld.name]==null || Number(item[fld.name]) == 0 ) {
                    if (errmsg != "") errmsg += ", ";
                    errmsg += fld.name;
                }
            }
        } );
        if (errmsg != "") {
            errmsg += " est/sont obligatoire(s)!";
            errmsgs.push(errmsg);
        }

        // RGs date début prestation :
        // La date de début de prestation doit être :
        // - supérieure ou égale à la date de début du contrat
        // - et strictement inférieure à la date de fin de contrat.
        let dateTest = item.dateDebutPrestation;
        if (item.contratAppli != "") {
            if ( this.communServ.checkDate(dateTest, "<", item.contrat.dateDebutContrat) )
                errmsgs.push("La date de début de prestation doit être supérieure ou égale à la date de début du contrat");
            if ( this.communServ.checkDate(dateTest, ">", item.contrat.dateFinContrat) )
                errmsgs.push("La date de début de prestation doit être antérieure à la date de fin du contrat");
        }
        // Elle doit être strictement inférieure à la date de fin de prestation si renseignée.
        if ( (item.dateFinPrestation > 0) && (dateTest > item.dateFinPrestation) )
            errmsgs.push("La date de début de prestation ne peut pas être après la date de fin");

        // S'il n'existe pas de mission en cours, mais il existe une mission terminée,
        // la date de début de prestation doit être supérieure à la date de fin de la dernière mission + 1 an.
        let terminatedMissions      = this.communServ.getItemsCond(this.collab.missions, "statutMission", "T");
        let lastTerminatedMission   = this.communServ.getLastItem(terminatedMissions, 'dateDebutMission', 'versionMission');
        if (lastTerminatedMission) {
            let dateLimite = this.communServ.convertStrToDate(lastTerminatedMission["dateFinSG"]);
            if (( dateLimite > 0) && (dateTest <= this.communServ.addToDate(dateLimite,[0,0,1])))
                errmsgs.push("La date de début de prestation ne peut être à moins d'1 an après la fin de la dernière mission.");
        }


        // RGs date de fin de la prestation :

        dateTest = item.dateFinPrestation;
        // Si la date de fin de la prestation est renseignée,
        if (dateTest > 0) {
            // > elle doit être supérieure ou égale à la date de début du contrat
            // et strictement inférieure à la date de fin de contrat.
            if (item.contratAppli != "") {
                if ( this.communServ.checkDate(dateTest, "<", item.contrat["dateDebutContrat"]) )
                    errmsgs.push("La date de fin de prestation doit être supérieure ou égale à la date de début du contrat");
                if ( this.communServ.checkDate(dateTest, ">", item.contrat["dateFinContrat"]) )
                    errmsgs.push("La date de fin de prestation doit être antérieure à la date de fin du contrat");
            }
            // > elle doit être strictement supérieure à la date de début de la prestation.
            if ( !(item.dateDebutPrestation > 0) || ( this.communServ.checkDate(dateTest, "<", item["dateDebutPrestation"]) ) )
                errmsgs.push("La date de fin de prestation ne peut pas être avant la date de début");
        }


        // S'il existe une mission en cours (ce n'est pas la première prestation du collaborateur)
        let actualMission = this.communServ.getArrayItemProp(this.collab.missions, "statutMission", "E", null);
        if ( actualMission ) {
            // -&& et s'il n'y a pas dérogation, la prestation ne peut pas dépasser 3 ans.
            if ( actualMission.derogation == "Non" ) {
                let dateLimite = this.communServ.convertStrToDate( actualMission["dateDebutMission"] );
                let dateLimite2 = this.communServ.addToDate( dateLimite,[0,0,3]);
                if ( ( dateLimite > 0 ) && ( dateTest >= dateLimite2))
                    errmsgs.push("La prestation ne peut pas dépasser la limite de 3 ans d'une mission.");
                // ToDo ? : check ne pas dépasser la durée de la mission (dateFinSg avant limite de 3 ans, comme dérogation).
            }
            // -&& et sinon s'il y a dérogation, la prestation ne peut pas dépasser la limite de la dérogation.
            else {
                // Pas de dérogation en cas d'ajout d'une presta : date limite = date à 3 ans
                // En cas de modif : 1 an de prolongation max, donc 4 ans maxi après début
                let nans = (item.id > 0) ? 3 : 4;
                let dateLimiteMax = this.communServ.convertStrToDate(actualMission["dateDebutMission"]);
                dateLimiteMax = this.communServ.addToDate(dateLimiteMax, [0, 0, nans]);

                let dateLimite = this.communServ.convertStrToDate(actualMission["dateFinSg"]);
                // Si pas de date limite indiquée alors default
                if ((dateLimite == 0) || (dateLimite > dateLimiteMax))
                    dateLimite = dateLimiteMax;

                if ( dateTest > dateLimite )
                    errmsgs.push("La prestation ne peut pas dépasser la limite de la dérogation de la mission ("+ this.communServ.dateStr(dateLimite) + ").");
            }

        }

        // (S'il existe une prestation de statut "En cours" (donc une mission En cours), une nouvelle prestation ne peut-être créée :
        // Ceci est géré par desactivation du bouton.)
        errmsg = errmsgs.join(" - ");
        if (errmsgs.length > 1) errmsg = " - " + errmsg;
        return errmsg ;
    }

    save() { // On save do add or update

        var item = this.selectedPrestation;

        // CHECK input
        let errMsg = this.checkInput(item);
        if (errMsg == "") {

            // >= ADD =<
            if (item.id == 0) {

                // Si aucune mission, en créer une avec comme date celle de la prestation, ensuite créer la presta avec l'id de la mission
                if ( this.collab.missions == undefined || this.collab.missions == null || this.collab.missions.length == 0)
                    this.missionService.addMission(null, item.dateDebutPrestation, item );
                else
                    this.addPrepare(item);
            }
            // >= UPDATE =<
            else {
                this.update("E");
            }
        }
        else this.errmsg(errMsg);
    }

    getLastVersion() {
        let lastVersion = 0;
        this.prestations.forEach(presta => {
                let version = Number(presta.versionPrestation);
                if ( version > lastVersion)
                    lastVersion = version;
            }
        );
        return lastVersion;
    }

    end() {
        this.confirmationService.confirm({
            message: "Confirmez vous la fermeture de la prestation ?", accept: () => {
                this.update("T");
            }
        });
    }

    cancelEditPresta() {
        if (this.selectedPrestation.id == 0)
            this.new();
        else
            this.selectPrestation(null, this.selectedPrestationOriginalValue);
    }

    onMissionAdded(mission) {

        // Once mission added, add the Prestation with id of mission
        this.selectedPrestation.identifiantMission = mission.id;
        this.addPrepare(this.selectedPrestation);
    }

    addPrepare(item) {

        // Set State of prestation to "En cours" Version "1"
        let newItemForDb = new Prestation(item);
        let version      = Number(this.getLastVersion()) + 1;
        this.communServ.setObjectValues(newItemForDb, null, {
            statutPrestation : "E", versionPrestation : version });

        // Si la date de fin de prestation n'a pas été renseignée, elle prendra la valeur de la date à 3 ans de la mission.
        if (!(newItemForDb.dateFinPrestation > 0)) {
            let actualMission = this.communServ.getArrayItemProp( this.collab.missions, "statutMission", "E", null);
            if (actualMission)
                newItemForDb.dateFinPrestation = this.communServ.addToDate( actualMission.dateDebutMission,[0,0,3]);
        }

        // Conversion dates en strings
        this.communServ.datePropsToStr(newItemForDb, this.dateFields );

        this.add(newItemForDb);
    }

    add(itemfordb) {

        this.communServ.setTimeStamp(itemfordb);
        this.prestationService.create(itemfordb).pipe(first()).subscribe(data => {

            let entity = "Prestation";
            var item = this.selectedPrestation;

            // Update item on success
            this.communServ.updateVersion(entity, item, data);

            // Update list
            this.updatelist("add", item);

            // Actual value becomes original value
            this.selectedPrestationOriginalValue = item;

            this.afficherLaSaisie("Visu");
            this.alertService.success(entity + " ajoutée");

        }, error => { this.errmsg(error); });
    }

    update( action : string) {

        let state = this.selectedPrestationOriginalValue.statutPrestation;

        this.updatePrestation("Prestation", action, this.selectedPrestation, this.selectedPrestationOriginalValue);

        // On save but last state was terminated : reOpen mission
        if ( action == "E" && state == 'T') {
            // Get mission of presta to update it
            this.missionService.getMission(this.selectedPrestation.identifiantMission).pipe(first()).subscribe(mission => {
                if (mission != undefined && mission != null)
                    this.missionService.updateMission("Mission", action, mission, this.missionService, false);
            },error => { this.errmsg(error); });
        }
    }

    // !! Also called from collab :
    updatePrestation(entity, action, currentValue, lastValue, callback=null ) {

        var dbService = this.prestationService;
        this.callback = callback;

        // Old value : Archive old value
        var dbold = new Prestation(lastValue);
        this.communServ.setObjectValues(dbold, null, { statutPrestation: "A",
            collaborateur : null, contrat : null, commercialOpenInfo : null } ); // Don't save collaborateur, contrat et commercial automatically
        this.communServ.datePropsToStr(dbold, this.dateFields);

        // New value : statut = action (T, ...), version++
        var dbnew = new Prestation(currentValue);
        let version = Number(this.getLastVersion())+1;
        this.communServ.setObjectValues(dbnew, null,{
            statutPrestation    : action,
            versionPrestation   : version,
            collaborateur : null, contrat : null, commercialOpenInfo : null } ); // ,,
        this.communServ.datePropsToStr(dbnew, this.dateFields);

        var dbupd = dbold; var upd = lastValue;
        var dbadd = dbnew; var add = currentValue;
        this.communServ.updateWithBackup("Prestation", upd, dbupd, add, dbadd, dbService, false );


    }

    onUpdatePrestationCompleted(param) {

        console.log("Prestations - onUpdatePrestationCompleted triggered");

        // If update from collab form only update info presta of collab no refresh
        // Only signal finished don't do default behavior
        if (this.callback)
            this.callback.emit();
        else {
            // Update list with new and archived values
            this.updatelist("change",   this.selectedPrestationOriginalValue );
            this.updatelist("add",      this.selectedPrestation );

            // New value becomes last value
            this.selectedPrestationOriginalValue = new Prestation(this.selectedPrestation);

            // Refresh screen
            this.afficherLaSaisie("Visu");
        }
    }

    updatelist(action, value, list = "prestations") {
        this[list] = this.communServ.updatelist(this[list], action, value, new Prestation(value), this.colDefs, "statutPrestation", this.orderDateDebutEtVersion, this.allstatus);
    }

    /*delete() {
        this.selectedPrestation.statutPrestation = (this.selectedPrestation.statutPrestation == "S") ? "E" : "S";
        this.prestationService.delete(this.selectedPrestation.id).pipe(first()).subscribe(data => {          },
                error => { this.alertService.error(error);  });
    }*/

    suppPrestation(item=null) {

        this.confirmationService.confirm({
            message: "Confirmez-vous la suppression ?",
            accept: () => {

               if (item) this.selectPrestation(null, item);
               this.update("S");
            }
        });
    }

    loadReferences() {

        this.references = [];
        var referenceslist = [
            {flds :[{ref:"contratAppli",    key:"contratAppli", label:"contratAppli"} ],       service:this.contratService,     uniquefilter : false},
            {flds :[{ref:"localisation",    key:"codeSite",     label:"libelleSite"} ],        service:this.siteService,        uniquefilter : false},
            {flds :[{ref:"numAtg",          key:"numeroAtg",    label:"numeroAtg"} ],          service:this.numAtgService,      uniquefilter : false},
            {flds :[{ref:"donneurOrdre",    key:"cleDo",        label:"donneurOrdre"} ],       service:this.donneurOrdreService, uniquefilter : false},
            {flds :[{ref:"commercialOpen",  key:"commercialOpen", label:"commercialOpen"} ],   service:this.commercialOpenService, uniquefilter : false},
            // Département Pole Domaine (Equipe)
            {flds :[{ref:"departement",     key:"departement",  label:"departement"},
                    {ref:"pole",            key:"pole",         label:"pole"},
                    {ref:"domaine",         key:"domaine",      label:"domaine"} ],            service:this.equipeService,      uniquefilter : true},
            {flds :[{ref:"responsablePole", key:"responsablePole", label:"responsablePole"} ], service:this.prestationService,  uniquefilter : true}
        ];
        referenceslist.forEach(
            defref => {

                // Clear references of field
                defref.flds.forEach( fld => { this.references[fld.ref]=[]; });

                // Load references of field (except if already loaded (responsable pole in global list))
                if (defref.flds[0].ref != "responsablePole" || this.modeCollab)
                    this.communServ.loadTableKeyValues(defref.flds, defref.service, this.references, defref.uniquefilter, true );
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == "collab")     //let curVal= changes[propName].currentValue;
                this.showCollab(null);
        }
    }

    // Load contrat (on value change)
    contratChanged() {
        let grp = "contrat"; let item = "contratAppli"; let notFoundValue = new Contrat();
        var dbServ = this.contratService;
        let selected = this.itemChanged(grp, item );
        dbServ.findByContrat(selected).pipe(first()).subscribe(data => { this.selectedPrestation[grp] = (data != null) ? data : notFoundValue;  });
    }

    // Load commercial (on value change)
    commercialOpenChanged() {
        let grp = "commercialOpenInfo"; let item = "commercialOpen"; let notFoundValue = new CommercialOpen();
        var dbServ = this.commercialOpenService;
        let selected = this.itemChanged(grp, item );
        dbServ.findByName(selected).pipe(first()).subscribe(data => { this.selectedPrestation[grp] = (data != null) ? data : notFoundValue;  });
    }

    itemChanged(grp, item) {
        let selected = this.selectedPrestation[grp][item]; // Selection of subobject
        this.selectedPrestation[item] = selected; // Save in prestation object
        return selected;
    }

    closeDialog() { this.closewindowPrestas.emit(); }
}
