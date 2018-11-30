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
    styleUrls: [ './prestations.component.css' ],
    providers : [PrestationService ]
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
            trigramme :             {header: 'Identifiant Pilote',  filtertype: "liste", showInList:true,  filtercond: null,  selected: ["testclear","testclearbis" ], values:[], keys:[]},
            dateDebutPrestation :   {header: 'Début',               filtertype: "date",  showInList:true,  filtercond: "gte", selected: "", values:"", keys:""},
            dateFinPrestation :     {header: 'Fin',                 filtertype: "date",  showInList:true,  filtercond: "lte", selected: "", values:"", keys:""},
            contratAppli :          {header: 'Contrat',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            numAtg:                 {header: 'ATG',                 filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            departement:            {header: 'Département',         filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            pole:                   {header: 'Pôle',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            domaine:                {header: 'Domaine',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            localisation:           {header: 'Site',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            numeroPu:               {header: 'PU',                  filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            responsablePole:        {header: 'Responsable de pôle', filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            donneurOrdre:           {header: 'Donneur ordre SG',    filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            topAtg:                 {header: 'Type',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            statutPrestation:       {header: 'Statut',              filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},
            commercialOpen:         {header: 'Nom prénom',          filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            versionPrestation:      {header: 'Version',             filtertype: "",      showInList:true,  filtercond: null,  selected: [], values:[], keys:[]},

            // Collaborateur
            nom:                    {header: "Nom",                 filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},
            prenom:                 {header: "Prénom",              filtertype: "",      showInList:false, filtercond: null,  selected: [], values:[], keys:[]},

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

        if (pCollab!=null)
            this.collab=pCollab;

        this.id = this.collab.trigramme;
        this.employee_name = this.collab.prenom + " " + this.collab.nom;
        this.selectPrestations(this.collab.prestations);
    }

    selectPrestations(param_prestations: Prestation[]) {
        this.prestations = param_prestations;
        this.updateFilters();
        if (this.prestations!=undefined)
            this.prestations.sort(this.orderDateDebutEtVersion); //this.filterVersions();
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

    selectPrestation(event: Event, prestation: Prestation) {

        this.displayDialogPresta = true;

        this.selectedPrestation = prestation;
        if (prestation.collaborateur == undefined) // We come from collaborateur so prestation not loaded by hibernate
            this.selectedPrestation.collaborateur = this.collab;
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

    updateFilters() {

        // Clear
        this.communServ.clearTableCol(this.coldefs, "values",   "filtertype", "liste", [], "");
        this.communServ.clearTableCol(this.coldefs, "selected", "filtertype", "liste", [], "");
        this.communServ.clearTableCol(this.coldefs, "keys",     "filtertype", "liste", [], []);

        this.showHistSelect = false;

        // trigramme, DateDebut, DateFin, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type, Statut, Version
        var labels: string[] = [];  // Labels collabs
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
                for (var column in this.coldefs) {
                    var keyvalue = row[column];
                    var value = "";
                    switch (column) {

                        case "trigramme" :
                            value = keyvalue;
                            labels[keyvalue] = keyvalue;
                            if (row.collaborateur != undefined)
                                labels[keyvalue] += " (" + row.collaborateur.nom + " " + row.collaborateur.prenom + ")";
                            break;

                        case "statutPrestation":
                            value = keyvalue;
                            break;

                        default :
                            value = (this.coldefs[column].filtertype == "date") ? keyvalue : (keyvalue == undefined || keyvalue == null ) ? "" : keyvalue.trim();

                    }
                    this.coldefs[column].keys[value] = value;
                    // Enregistrer même valeur (vide) pour sélection
                    if (value != keyvalue)
                        row[column]=value;
                }
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
        var value = this.coldefs[field].selected;
        if (this.coldefs[field].filtertype == "date") {
            var valuedate = 0;
            var cond="gt";
            if (value!=null) {
                valuedate = value.valueOf(); //valuedate = event.valueOf().toString(); //valuedate = this.datePipe.transform(value, 'yyyy-MM-dd');
                cond = this.coldefs[field].filtercond;
                if      (cond=="gte") { cond="gt"; valuedate -= 86400000; } // 86400000 = 1 jour en millis
                else if (cond=="lte") { cond="lt"; valuedate += 86400000; }
            }
            this.pt.filter(valuedate, field, cond );
        }
        else
            this.pt.filter(value, field, this.coldefs[ field ].filtercond);
    }

    save() { }
    end() { }
    delete() { }
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

                defref.flds.forEach( fld => {
                    this.references[fld.ref]=[];
                });
                if (defref.flds[0].ref!="responsablePole" || this.modeCollab)
                    this.loadTableKeyValues(defref.flds, defref.service, this.references, defref.uniquefilter );
            }
        );

    }


    loadTableKeyValues(flds, tableService, itemsarray, uniquevalues) {

        tableService.list()
            .pipe(first())
            .subscribe( rows => {

                    flds.forEach( fld => {

                        itemsarray[fld.ref]=[];

                        if (uniquevalues) {

                            // Unique values
                            var keys: string[] = [];
                            rows.forEach(row => {
                                row[fld.key] = (row[fld.key] == undefined || row[fld.key] == null) ? "" : row[fld.key].trim();
                                keys[row[fld.key]] = row[fld.label];
                            });
                            // Lists for combos
                            for (var item in keys) {
                                itemsarray[fld.ref].push({value: item, label: keys[item]});
                            }
                        }
                        else
                            rows.forEach( row => { itemsarray[fld.ref].push({ value: row[fld.key], label: row[fld.label] }); } );

                        // Sort
                        itemsarray[fld.ref].sort(this.communATGService.orderSelectItems);
                    }
                    );
                },
                error => { this.alertService.error(error); }
            );
    }


    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == "collab") {    //let curVal= changes[propName].currentValue;
                this.showCollab(null);
            }
        }
    }

    closeDialog() {  this.closewindowPrestas.emit();   }
}
