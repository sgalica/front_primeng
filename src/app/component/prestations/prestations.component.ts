import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, CommercialOpen, Contrat, Prestation} from "../../model/referentiel";
import {CommercialOpenService, ContratService, DonneurOrdreService, EquipeService, NumAtgService, PrestationService, SiteService} from "../../service/datas.service";
import {DatePipe} from "@angular/common";

interface filteritem {
    selected: any;
    values: SelectItem[];
    keys: string[];
    filtertype:string;
    filtercond:string;
    fmt;string;
    fmt2:string;
}

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
    prestations: Prestation[] = [];
    cols: any[];
    selectedColumns: any[];
    filteritem: { selected: any, values: SelectItem[], keys: string[], filtertype: string, filtercond: string, fmt:string, fmt2:string };
    filtres: filteritem[] = [];
    coldefs: { header: string, field: string, filtertype: string, filtercond: string, fmt: string, fmt2: string, showInList: boolean }[];
    refCols: { header: string, field: string }[];
    colsIndex : string[];

    // Collaborateur
    id: string;
    employee_name: string = "";
    employee: Collaborateur = new Collaborateur();

    // Fiche/Detail
    selectedPrestation: Prestation = new Prestation();
    
    displayDialogPresta: boolean = false;

    // Références
    missions: { label: string, value: number }[];
    allstatus: { label: string, value: string }[] = [ {value: "E", label: "En cours"}, { value: "T", label: "Terminées"}, {value: "S", label: "Supprimées"}, {value: "A", label: "Archivées"} ];
    allstatusidx : string[];
    contrats : SelectItem[]=[];
    references : any[]=[];

    showHistSelect: boolean = false;

    buttons_list : String[] = ["Save", "End", "Delete", "Cancel", "Reopen"];
    buttons : Object; // {label:String, disabled:Boolean}[] = []

    fr: any;

    FieldsFiches : any[];

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

        private router: Router, private route: ActivatedRoute, private alertService: AlertService, private datePipe:DatePipe
    ) {}

    ngOnInit() {

        // Mode ALL prestations from service or COLLAB (Prestations from collab)
        if (this.route.snapshot.url[ 0 ].path != ("prestations"))
            this.modeCollab = true;
        this.prestations = [];
        this.selectedPrestation.collaborateur = new Collaborateur();
        this.selectedPrestation.contrat = new Contrat();
        this.selectedPrestation.commercialOpenInfo = new CommercialOpen();


        // Columns
        // Cols depending on ID
        this.coldefs = [
//          {header: 'Id', field:'prestId'},
//          {header: 'Id Mission', field:'prestIdMission'}, identifiantPrestation
            {header: 'Identifiant Pilote',  field: 'trigramme',             filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Début',               field: 'dateDebutPrestation',   filtertype: "date",  showInList:true,  filtercond: "gte", fmt: "dd/mm/yy", fmt2 :"dd/MM/yyyy"},
            {header: 'Fin',                 field: 'dateFinPrestation',     filtertype: "date",  showInList:true,  filtercond: "lte", fmt: "dd/mm/yy", fmt2 :"dd/MM/yyyy"},
            {header: 'Contrat',             field: 'contratAppli',          filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'ATG',                 field: 'numAtg',                filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Département',         field: 'departement',           filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Pôle',                field: 'pole',                  filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Domaine',             field: 'domaine',               filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Site',                field: 'localisation',          filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'PU',                  field: 'numeroPu',              filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Responsable de pôle', field: 'responsablePole',       filtertype: "liste", showInList:false, filtercond: null, fmt: null, fmt2 :null},
            {header: 'Donneur ordre SG',    field: 'donneurOrdre',          filtertype: "liste", showInList:false, filtercond: null, fmt: null, fmt2 :null},
            {header: 'Type',                field: 'topAtg',                filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Statut',              field: 'statutPrestation',      filtertype: "liste", showInList:true,  filtercond: null, fmt: null, fmt2 :null},
            {header: 'Nom prénom',          field: 'commercialOpen',        filtertype: "liste", showInList:false, filtercond: null, fmt: null, fmt2 :null},
            {header: 'Version',             field: 'versionPrestation',     filtertype: "",      showInList:true,  filtercond: null, fmt: null, fmt2 :null}
            //{header: 'Début',               field: 'dateDebutPrestationTri', filtertype: "datestr", filtercond: "gt", fmt: "yy-mm-dd", fmt2 :"yyyy-MM-dd"},
            //{header: 'Fin',                 field: 'dateFinPrestationTri', filtertype: "datestr", filtercond: "lt", fmt: "yy-mm-dd", fmt2 :"yyyy-MM-dd"}
            /*          {header: 'com_open', field:'prestCommercialOPEN'},

                        {header: 'date_c', field:'prestDateCreation'},
                        {header: 'user_c', field:'prestUserCreation'},
                        {header: 'date_m', field:'prestDateMaj'},
                        {header: 'user_m', field:'prestUserMaj'},   */
        ];
        this.refCols=[
            // Collaborateur
            {field:"nom", header:"Nom"},
            {field:"prenom", header:"Prénom"},
            // Contrat
            {field:"dateDebutContrat", header:"Date début"},
            {field:"dateFinContrat", header:"Date fin"},
            // Commercial Open
            {field:"adresseMail", header:"Mail"},
            {field:"telephonePortable", header:"Tél. portable"},
            {field:"telephoneFixe", header:"Tél. fixe"}
        ];

        this.selectColumns();
        this.createColsIndex();
        this.createStatusIndex();

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

        this.initFilters();
        this.displayDialogPresta = false;

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
            "Save"   : {label:"Enregistrer", disabled:true},
            "End"    : {label:"Terminer",    disabled:true},
            "Delete" : {label:"Supprimer",   disabled:false},
            "Cancel" : {label:"Annuler",     disabled:true},
            "Reopen" : {label:"Ré-ouvrir la prestation", disabled:true}
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

    orderSelectItems(a, b)      { var fld="value"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }
    orderSelectItemsLabel(a, b) { var fld="label"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }

    selectColumns() {

        this.cols = [];
        this.coldefs.forEach(x => {
            // Cols depend on all or collab prestations
            if ( !((x.field == "trigramme") && (this.modeCollab) ) && x.showInList )
                Array.prototype.push.apply(this.cols, [ {header: x.header, field: x.field} ]);
        });

        this.selectedColumns = this.cols;
    }

    createColsIndex() {
        // Libellés champs
        this.colsIndex = [];
        // Prestation
        this.coldefs.forEach(x => { this.colsIndex[x.field]=x.header;  });
        // Tables référentiel
        this.refCols.forEach(x => { this.colsIndex[x.field]=x.header;  });
    }

    createStatusIndex() {
        this.allstatusidx = [];
        this.allstatus.forEach(x => { this.allstatusidx[x.value] = x.label; });
    }

    initFilters() {
        // Create filterliste
        if (this.coldefs != undefined) {
            this.coldefs.forEach(x => {
                var filteritem = (x.filtertype == "liste") ?
                      { selected: [], values: [], keys: [], filtertype: x.filtertype, filtercond: x.filtercond, fmt: x.fmt, fmt2: x.fmt2 }
                    : { selected: "", values: "", keys: [], filtertype: x.filtertype, filtercond: x.filtercond, fmt: x.fmt, fmt2: x.fmt2 };
                this.filtres[x.field] = filteritem;
            });
        }
     };

    selectPrestation(event: Event, prestation: Prestation) {
        this.displayDialogPresta = true;

        this.selectedPrestation = prestation;
        if (prestation.collaborateur == undefined) // We come from collaborateur so prestation not loaded by hibernate
            this.selectedPrestation.collaborateur = this.collab;
        //this.employee = this.selectedPrestation.collaborateur;
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
                    Array.prototype.push.apply(this.references[ref], this.filtres[ref].values);
                    //this.alertService.success(prestations);
                },
                error => {
                    this.alertService.error(error);
                });
    }

    updateFilters() {

        this.showHistSelect = false;
        this.initFilters();
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

                //x.dateDebutPrestationTri = this.datePipe.transform(x.dateDebutPrestation, 'yyyy-MM-dd'); //x.dateDebutPrestation.valueOf();

                // >>>> Get keys <<<<<
                for (var column in this.filtres) {
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
                            value = (this.filtres[column].filtertype == "date") ? keyvalue : (keyvalue == undefined || keyvalue == null ) ? "" : keyvalue.trim();

                    }
                    this.filtres[column].keys[value] = value;
                    // Enregistrer même valeur (vide) pour sélection
                    if (value != keyvalue)
                        row[column]=value;
                }
            });
        }

        let selectitems: SelectItem[] = [];
        for (var column in this.filtres) {
            selectitems = [];
            var selectitem = "";
            var col_sort = [];
            switch (column) {

                case "statutPrestation" :
                    var statusdispos = this.allstatus;
                    //if (!this.modeCollab) statusdispos.splice(3,1);
                    // Add labels ordered as E, T, S, A
                    var statutkeys = this.filtres[ column ].keys;
                    for (var i in statusdispos) {
                        var statut = statusdispos[i].value;
                        var isPresent = false;
                        for( var key in statutkeys) { if(statutkeys[key]==statut) isPresent = true;  }
                        if (isPresent)
                            selectitems.push( {label: statusdispos[ i ].label, value: statusdispos[ i ].value} );
                    }

                    // Version
                    // this.filtres["prestVersion"] = {selected : "", values:[ {label: 'Historique', value: 'H'},  {label: 'Dernière', value: ''} ], keys:[] };
                    break;

                default : // trigramme, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type
                    // Sort
                    for (var key in this.filtres[ column ].keys) {
                        col_sort.push(key);
                    }
                    col_sort.sort();

                    // Add to filterlist
                    for (var k in col_sort) {
                        var label = (col_sort[k]=="") ? " [ Vide ]" : (column == "trigramme") ? labels[ col_sort[ k ] ] : col_sort[ k ];
                        selectitems.push({label: label, value: col_sort[ k ]});
                    }
                    break;
            }

            this.filtres[ column ].values = selectitems;
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
        var fld= "dateDebutPrestation";
        var retval = (a[fld] > b[fld]) ? -1 : (a[fld] < b[fld]) ? 1 : 0; ;
        if (retval==0) {
            fld= "versionPrestation";
            retval = (a[fld] > b[fld]) ? -1 : (a[fld] < b[fld]) ? 1 : 0;;
        }
        return retval;
    }



    filterVersions() {
        // Si E T ou S pas d'historique, si affichage complète (E T et S) également affichage Historique si coché.

        var statushist: string[];

        // Multiselect
        var status: string[] = this.filtres[ "statutPrestation" ].selected; // this.selectedPrestas.status;

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
        var value = this.filtres[ field ].selected;
        if (this.filtres[ field ].filtertype == "date") {
            var valuedate = 0;
            var cond="gt";
            if (value!=null) {
                valuedate = value.valueOf(); //valuedate = event.valueOf().toString(); //valuedate = this.datePipe.transform(value, 'yyyy-MM-dd');
                cond = this.filtres[ field ].filtercond;
                if      (cond=="gte") { cond="gt"; valuedate -= 86400000; } // 86400000 = 1 jour en millis
                else if (cond=="lte") { cond="lt"; valuedate += 86400000; }
            }
            this.pt.filter(valuedate, field, cond );
        }
        else
            this.pt.filter(value, field, this.filtres[ field ].filtercond);
    }

    //    buttons_list : String[] = ["Save","End","Delete","Cancel","Reopen"];
    buttonsFunctions( btn: string ) {
        switch (btn) {
            case "Save"   : this.save(); break;
            case "End"    : this.end(); break;
            case "Delete" : this.delete(); break;
            case "Cancel" : this.cancel(); break;
            case "Reopen" : this.reopen();break;
        }
    }
    save() { }
    end() { }
    delete() { }
    cancel() { }
    reopen() { }
    
 
    loadReferences() {
        this.references = [];
        var referenceslist=[
            {flds :[{ref:"contratAppli", key:"contratAppli",label:"contratAppli"} ],       service:this.contratService,    uniquefilter : false},
            {flds :[{ref:"localisation", key:"codeSite",    label:"libelleSite"} ],        service:this.siteService,       uniquefilter : false},
            {flds :[{ref:"numAtg",       key:"numeroAtg",   label:"numeroAtg"} ],          service:this.numAtgService,     uniquefilter : false},
            {flds :[{ref:"donneurOrdre", key:"cleDo",       label:"donneurOrdre"} ],       service:this.donneurOrdreService, uniquefilter : false},
            {flds :[{ref:"commercialOpen", key:"commercialOpen", label:"commercialOpen"} ],service:this.commercialOpenService, uniquefilter : false},
            // Département Pole Domaine (Equipe)
            {flds :[{ref:"departement", key:"departement",  label:"departement"},
                    {ref:"pole",        key:"pole",         label:"pole"},
                    {ref:"domaine",     key:"domaine",      label:"domaine"} ],                service:this.equipeService,      uniquefilter : true},
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
                        itemsarray[fld.ref].sort(this.orderSelectItems);
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

    closeDialog() {
        this.closewindowPrestas.emit();
    }
}
