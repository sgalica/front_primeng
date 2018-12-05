import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, CommercialOpen, Contrat, Prestation} from "../../model/referentiel";
import {CommercialOpenService, ContratService, DonneurOrdreService, EquipeService, NumAtgService, PrestationService, SiteService} from "../../service/datas.service";
import {DatePipe} from "@angular/common";
import {CommunATGService} from "../../service/communATG.service";

@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: [ './prestations.component.css' ]
})
export class PrestationsComponent implements OnInit, OnChanges {

    title : string = "Prestation";

    @Input()  collab : Collaborateur;
    @Output() closewindowPrestas = new EventEmitter<boolean>();

    @ViewChild(('pt'))
    pt: DataTable;

    modeCollab : boolean = false;


    // Liste
    prestations : Prestation[] = [];
    cols        : any[];
    selectedColumns : any[];
    coldefs     : {}; //{ header: string, field: string, filtertype: string, filtercond: string, selected:[]/"" showInList: boolean }[];

    // Collaborateur
    id: string;
    employee_name: string = "";

    // Fiche/Detail
    selectedPrestation: Prestation = new Prestation();
    displayDialogPresta: boolean = false;

    // Références
    missions : { label: string, value: number }[];
    allstatus = { E : "En cours", T: "Terminées", S: "Supprimées", A: "Archivées" };
    contrats : SelectItem[]=[];
    references : any[]=[];

    showHistSelect: boolean = false;

    buttonsList : String[] = ["Save", "End", "Delete", "Cancel", "Reopen"];
    buttons : Object; // {label:String, disabled:Boolean}[] = []

    FieldsFiches : any[];

    communServ : CommunATGService;

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

    constructor(
        private prestationService: PrestationService,

        private contratService: ContratService,
        private siteService: SiteService,
        private numAtgService: NumAtgService,
        private equipeService : EquipeService, // Departement, Pôle, Domaine, 
        private donneurOrdreService: DonneurOrdreService,
        private commercialOpenService: CommercialOpenService,
        // private respPoleService: Service, // Resp pôle

        private router: Router, private route: ActivatedRoute,
        private alertService: AlertService,
        private datePipe:DatePipe,
        private communATGService : CommunATGService
    ) {}


    ngOnInit() {

        this.communServ = this.communATGService;

        // Mode ALL prestations from service or COLLAB (Prestations from collab)
        if (this.route.snapshot.url[ 0 ].path != ("prestations"))
            this.modeCollab = true;
        this.prestations = [];
        this.selectedPrestation.collaborateur = new Collaborateur();
        this.selectedPrestation.contrat = new Contrat();
        this.selectedPrestation.commercialOpenInfo = new CommercialOpen();

        // Columns
        // Cols depending on ID
        //this.col_list = ["trigramme", "dateDebutPrestation", "dateFinPrestation", "contratAppli", "numAtg", "departement", "pole", "domaine", "localisation", "numeroPu", "responsablePole", "donneurOrdre", "topAtg", "statutPrestation", "commercialOpen", "versionPrestation",
        //    "nom", "prenom", "dateDebutContrat", "dateFinContrat", "adresseMail", "telephonePortable", "telephoneFixe"];

        this.coldefs = {
            trigramme :             {header: 'Identifiant Pilote',  filtertype: "liste", showInList:true,  filtercond: null,  selected: ["testclear","testclearbis" ], values:[], keys:[], keycol:true},
            dateDebutPrestation :   {header: 'Début',               filtertype: "date",  showInList:true,  filtercond: "gte", selected: "", values:"", keys:"", keycol:false},
            dateFinPrestation :     {header: 'Fin',                 filtertype: "date",  showInList:true,  filtercond: "lte", selected: "", values:"", keys:"", keycol:false},
            contratAppli :          {header: 'Contrat',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            numAtg:                 {header: 'ATG',                 filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            departement:            {header: 'Département',         filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            pole:                   {header: 'Pôle',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            domaine:                {header: 'Domaine',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            localisation:           {header: 'Site',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            numeroPu:               {header: 'PU',                  filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:false},
            responsablePole:        {header: 'Responsable de pôle', filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            donneurOrdre:           {header: 'Donneur ordre SG',    filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            topAtg:                 {header: 'Type',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:false},
            statutPrestation:       {header: 'Statut',              filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:false},
            commercialOpen:         {header: 'Nom prénom',          filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[], keycol:true},
            versionPrestation:      {header: 'Version',             filtertype: "",      showInList:true,  filtercond: null,  selected: [], values:[], keys:[], keycol:false},

            // Collaborateur
            nom:                    {header: "Nom",                 filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[], keycol:false},
            prenom:                 {header: "Prénom",              filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[], keycol:false},

            // Contrat
            dateDebutContrat:       {header: "Date début",          filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            dateFinContrat:         {header: "Date fin",            filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},

            // Commercial Open
            adresseMail:            {header: "Mail",                filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            telephonePortable:      {header: "Tél. portable",       filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            telephoneFixe:          {header: "Tél. fixe",           filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]}

            /* {header: 'date_c', field:'prestDateCreation'}, {header: 'user_c', field:'prestUserCreation'}, {header: 'date_m', field:'prestDateMaj'}, {header: 'user_m', field:'prestUserMaj'},   */
        };

        this.selectColumns();

        this.FieldsFiches=[
            {grp: "collaborateur",  grplabel : "Prestataire",
                fields :   [{name:"trigramme",      type:"field"},                 {name:"nom",                 type:"field"},                  {name:"prenom",             type:"field"}]},
            {grp: "contrat",        grplabel : "Contrat",
                fields :   [{name:"contratAppli",   type:"combo", editable:false}, {name:"dateDebutContrat",    type:"date"},                   {name:"dateFinContrat",     type:"date"}]},
            {grp: "Prestation",     grplabel : "Prestation",
                fields :   [{name:"localisation",   type:"combo", editable:false}, {name:"numAtg",              type:"combo", editable:false},
                            {name:"departement",    type:"combo", editable:false}, {name:"pole",                type:"combo", editable:false},  {name:"domaine",            type:"combo", editable:false},
                            {name:"numeroPu",       type:"field"},                 {name:"dateDebutPrestation", type:"date"},                   {name:"dateFinPrestation",  type:"date"},
                            {name:"responsablePole",type:"combo", editable:true},
                            {name:"donneurOrdre",   type:"combo", editable:false}]},
            {grp: "commercialOpenInfo", grplabel : "Commercial OPEN",
                fields :   [{name:"commercialOpen", type:"combo", editable:false}, {name:"adresseMail",         type:"field"},                  {name:"telephonePortable",  type:"field"},      {name:"telephoneFixe", type:"field"} ] }
        ];

        this.displayDialogPresta = false;

        this.buttons = {
            "Save"   : {label:"Enregistrer", disabled:true,  fnc : ()=>{this.save();} },
            "End"    : {label:"Terminer",    disabled:true,  fnc : ()=>{this.end();} },
            "Delete" : {label:"Supprimer",   disabled:false, fnc : ()=>{this.delete();} },
            "Cancel" : {label:"Annuler",     disabled:true,  fnc : ()=>{this.cancel();} },
            "Reopen" : {label:"Ré-ouvrir la prestation", disabled:true,  fnc : ()=>{this.reopen();} }
        };

        if (!this.modeCollab)
            this.loadAllPrestations();

        this.loadReferences();
    }

    showCollab(pCollab:Collaborateur) {

        if (pCollab != null)
            this.collab = pCollab;

        this.id = this.collab.trigramme;
        this.employee_name = this.collab.prenom + " " + this.collab.nom;
        this.selectPrestations(this.collab.prestations);
    }

    selectColumns() {

        this.selectedColumns = this.communServ.filterTableSelectItems(this.coldefs, 'showInList', 'header');

        // Cols depend on all or collab prestations
        // Remove trigramme if mode collab
        // !((key == "trigramme") && (this.modeCollab) ) &&
        if (this.modeCollab) {
            var pos = 0;
            this.selectedColumns.forEach( colval => {
                if (colval.field=="trigramme") {
                    this.selectedColumns.splice(pos, 1);
                }
                else
                    pos++;
            });
        }

        this.cols=this.selectedColumns;
    }

    loadAllPrestations() {
        this.prestationService.list()
            .pipe(first())
            .subscribe(prestations => {
                    this.selectPrestations(prestations);
                    this.filterVersions();
                    // RespsPole : If all prestations loaded, we can take values from filters
                    var ref = "responsablePole";
                    Array.prototype.push.apply(this.references[ref], this.coldefs[ref].values);
                    //this.alertService.success(prestations);
                },
                error => { this.alertService.error(error);  });
    }

    selectPrestations(param_prestations: Prestation[]) {

        this.prestations = param_prestations;
        this.updateFilters();
        if (this.prestations!=undefined)
            this.prestations.sort(this.orderDateDebutEtVersion); //this.filterVersions();

    }

    updateFilters() {

        // Clear
        if (this.communServ) {
            this.communServ.clearTableCol(this.coldefs, "values",   "filtertype", "liste", [], "");
            this.communServ.clearTableCol(this.coldefs, "selected", "filtertype", "liste", [], "");
            this.communServ.clearTableCol(this.coldefs, "keys",     "filtertype", "liste", [], []);
        }

        this.showHistSelect = false;

        // trigramme, DateDebut, DateFin, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type, Statut, Version
        var labels: {} = {};  // Labels collabs
        if (this.prestations != undefined) {
            this.prestations.forEach(row => {

                // Retrieve trigramme if acces by table presta (done here to avoid double foreach)
                if (row.collaborateur != undefined)
                    row.trigramme = row.collaborateur.trigramme;

                // Format dates
                var datearr =   row.dateDebutPrestation.split("/"); //dd/mm/yyyy
                row.dateDebutPrestation = new Date(datearr[2], datearr[1] - 1, datearr[0]);
                datearr =       row.dateFinPrestation.split("/");
                row.dateFinPrestation   = new Date(datearr[2], datearr[1] - 1, datearr[0]);

                // >>>> Get keys <<<<<
                this.communServ.setKeys(this.coldefs, row );
                this.communServ.setLabel(labels, row.collaborateur, "trigramme",["nom", "prenom"]);

            });
        }

        for (var column in this.coldefs) {
            let selectitems: SelectItem[];
            switch (column) {

                case "statutPrestation" :
                    // Add labels ordered as E, T, S, A
                    selectitems = this.communServ.filterSelectItems(this.allstatus, this.coldefs[ column ].keys);
                    // Version :  // this.filtres["Version"] = {selected : "", values:[ {label: 'Historique', value: 'H'},  {label: 'Dernière', value: ''} ], keys:[] };
                    break;

                default : // trigramme, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type
                    // Sort keys
                    var colSort = this.communServ.convertMapToArray(this.coldefs[ column ].keys); colSort.sort();
                    // Add to filterlist
                    selectitems = this.communServ.createSelectItemsFromArray(colSort, labels );
                    break;
            }
            this.coldefs[column].values = selectitems;
        }
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
        var status: string[] = this.coldefs["statutPrestation"].selected; // this.selectedPrestas.status;

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
        var condition = {cond:this.coldefs[ field ].filtercond, value:this.coldefs[field].selected};
        if (this.coldefs[field].filtertype == "date")
            condition = this.convertDateGteLteToGtLt(condition);

        this.pt.filter(condition.value, field, condition.cond);
    }

    convertDateGteLteToGtLt(pCondition) {
        var condition = {cond:"gt", value:0};

        if (pCondition.value!=null) {
            condition.value = pCondition.value.valueOf(); //valuedate = event.valueOf().toString(); //valuedate = this.datePipe.transform(value, 'yyyy-MM-dd');
            if      (pCondition.cond=="gte") { condition.cond="gt"; condition.value -= 86400000; } // 86400000 = 1 jour en millis
            else if (pCondition.cond=="lte") { condition.cond="lt"; condition.value += 86400000; }
        }
        return condition;
    }

    selectPrestation(event: Event, prestation: Prestation) {

        this.displayDialogPresta = true;

        this.selectedPrestation = prestation;
        if (prestation.collaborateur == undefined) // We come from collaborateur so prestation not loaded by hibernate
            this.selectedPrestation.collaborateur = this.collab;
    }

    save() {
        this.prestationService.create(this.selectedPrestation)
            .pipe(first())
            .subscribe(
                data => {
                    // To do : message save ok
                    //this.router.navigate(["/prestations"]);
                },
                error => { this.alertService.error(error);  });
    }

    delete() {
        this.selectedPrestation.statutPrestation = (this.selectedPrestation.statutPrestation == "S") ? "E" : "S";
        this.prestationService.delete(this.selectedPrestation.id)
            .pipe(first())
            .subscribe(
                data => {
                },
                error => { this.alertService.error(error);  });
    }

    end() { }
    cancel() { }
    reopen() { }
    
 
    loadReferences() {
        this.references = [];
        var referenceslist=[
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
                // Load references of field
                if (defref.flds[0].ref != "responsablePole" || this.modeCollab)
                    this.communServ.loadTableKeyValues(defref.flds, defref.service, this.references, defref.uniquefilter );
            }
        );

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == "collab")     //let curVal= changes[propName].currentValue;
                this.showCollab(null);
        }
    }

    closeDialog() { this.closewindowPrestas.emit(); }
}
