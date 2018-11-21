import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, Contrat, Prestation} from "../../model/referentiel";
import {
    CollaborateurService,
    CommercialOpenService,
    ContratService,
    DonneurOrdreService,
    EquipeService,
    NumAtgService,
    PrestationService,
    SiteService
} from "../../service/datas.service";
import {DatePipe} from "@angular/common";

interface filteritem {
    selected: any;
    values: SelectItem[];
    keys: string[];
}

@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: [ './prestations.component.css' ]
})
export class PrestationsComponent implements OnInit, OnChanges {

    title : string="Prestation";

    @Input()
    collab: Collaborateur;

    @ViewChild(('pt'))
    pt: DataTable;

    modeCollab: boolean = false;


    // Liste
    prestations: Prestation[] = [];
    cols: any[];
    selectedColumns: any[];
    filteritem: { selected: any, values: SelectItem[], keys: string[], type: string, filtercond: string, fmt:string, fmt2:string };
    filtres: filteritem[] = [];
    coldefs: { header: string, field: string, filtertype: string, filtercond: string, fmt : string, fmt2:string }[];
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
    buttons : {label:String, disabled:Boolean}[]= [];

    fr: any;

    FieldsFiches : any[];

    rowcolors: {};

    //sortOptions: SelectItem[]; sortField: string; sortOrder: number;


    constructor(
        private prestationService: PrestationService,
        private contratService: ContratService,
        private siteService: SiteService,
        private numAtgService: NumAtgService,
        private equipeService : EquipeService, // Departement, Pôle, Domaine, 
        // private respPoleService: Service, // Resp pôle
        private donneurOrdreService: DonneurOrdreService,
        private commercialOpenService: CommercialOpenService,
        private employeeService: CollaborateurService,
        private router: Router, private route: ActivatedRoute, private alertService: AlertService, private datePipe:DatePipe ) {}

    ngOnInit() {

        // Prestations from collab
        if (this.route.snapshot.url[ 0 ].path != ("prestations")) {
            this.modeCollab = true;
        }
        this.prestations = [];
        this.selectedPrestation.collaborateur = new Collaborateur();
        this.selectedPrestation.contrat = new Contrat();

        // Columns
        // Cols depending on ID
        this.coldefs = [];
        Array.prototype.push.apply(this.coldefs, [
//          {header: 'Id', field:'prestId'},
//          {header: 'Id Mission', field:'prestIdMission'}, identifiantPrestation
            {header: 'Identifiant Pilote',  field: 'trigramme', filtertype: "liste"},
            {header: 'Début',               field: 'dateDebutPrestation', filtertype: "date", filtercond: "gte", fmt: "dd/mm/yy", fmt2 :"dd/MM/yyyy"  },
            {header: 'Fin',                 field: 'dateFinPrestation', filtertype: "date", filtercond: "lte", fmt: "dd/mm/yy", fmt2 :"dd/MM/yyyy"},
            {header: 'Contrat',             field: 'contratAppli', filtertype: "liste"},
            {header: 'ATG',                 field: 'numAtg', filtertype: "liste"},
            {header: 'Département',         field: 'departement', filtertype: "liste"},
            {header: 'Pôle',                field: 'pole', filtertype: "liste"},
            {header: 'Domaine',             field: 'domaine', filtertype: "liste"},
            {header: 'Site',                field: 'localisation', filtertype: "liste"},
            {header: 'PU',                  field: 'numeroPu', filtertype: "liste"},
            {header: 'Responsable de pôle', field: 'responsablePole', filtertype: "liste"},
            {header: 'Donneur ordre SG',    field: 'donneurOrdre', filtertype: "liste"},
            {header: 'Type',                field: 'topAtg', filtertype: "liste"},
            {header: 'Statut',              field: 'statutPrestation', filtertype: "liste"},
            {header: 'Nom prénom',          field: 'commercialOpen', filtertype: "liste"},
            {header: 'Version',             field: 'versionPrestation', filtertype: ""}
            //{header: 'Début',               field: 'dateDebutPrestationTri', filtertype: "datestr", filtercond: "gt", fmt: "yy-mm-dd", fmt2 :"yyyy-MM-dd"},
            //{header: 'Fin',                 field: 'dateFinPrestationTri', filtertype: "datestr", filtercond: "lt", fmt: "yy-mm-dd", fmt2 :"yyyy-MM-dd"}
            /*          {header: 'com_open', field:'prestCommercialOPEN'},

                        {header: 'date_c', field:'prestDateCreation'},
                        {header: 'user_c', field:'prestUserCreation'},
                        {header: 'date_m', field:'prestDateMaj'},
                        {header: 'user_m', field:'prestUserMaj'},   */
        ]);

        this.selectColumns();
        this.createColsIndex();
        this.createStatusIndex();

        this.FieldsFiches=[
            {grp: "collaborateur",  grplabel : "Prestataire",       fields : [{name:"trigramme", type:"field"}, {name:"nom", type:"field"}, {name:"prenom", type:"field"}]},
            {grp: "contrat",        grplabel : "Contrat",           fields : [{name:"contratAppli", type:"combo"},{name:"dateDebutContrat", type:"date"},{name:"dateFinContrat", type:"date"}]},
            {grp: "Prestation",     grplabel : "Prestation",        fields : [{name:"localisation", type:"combo"}, {name:"numAtg", type:"combo"},
                    {name:"departement", type:"combo"}, {name:"pole", type:"combo"}, {name:"domaine", type:"combo"},
                    {name:"numeroPu", type:"field"},{name:"dateDebutPrestation", type:"date"}, {name:"dateFinPrestation", type:"date"},
                    {name:"responsablePole", type:"field"},
                    {name:"donneurOrdre", type:"combo"}]},
            {grp: "Commercial",     grplabel : "Commercial OPEN",   fields : [{name:"commercialOpen", type:"combo"}] } // mail, tel portable, tel fixe
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

        this.buttons["Save"] = {label:"Enregistrer", disabled:true};
        this.buttons["End"] = {label:"Terminer", disabled:true};
        this.buttons["Delete"] ={label:"Supprimer", disabled:false};
        this.buttons["Cancel"] ={label:"Annuler", disabled:true};
        this.buttons["Reopen"] ={label:"Ré-ouvrir la prestation", disabled:true};

        // Presentation
        this.rowcolors = {"E": "rgba(rgba(250,200,240,1))", "T": "rgba(200,200,200,0.2)"}
        // MODE ALL or COLLAB
        //this.sortOptions = [ {label: 'Newest First', value: '!nom'}, {label: 'Oldest First', value: 'prenom'}, {label: 'Brand', value: 'brand'}        ];
        //console.log("test:",this.route.snapshot.url[ 0 ].path == ("prestations"));
        if (this.route.snapshot.url[ 0 ].path == ("prestations")) {
            this.loadAllPrestations();
            //if this.route.snapshot.params['idcollab']; this.loadPrestationsCollab(id); //console.log("liste des prestation du collab" , this.prestations);
        }

        this.loadReferences();
    }

    showCollab(pCollab:Collaborateur) {
        this.collab=pCollab;
        this.id = this.collab.trigramme;
        this.employee_name = this.collab.prenom + " " + this.collab.nom;
        this.selectPrestations(this.collab.prestations);
    }

    selectPrestations(param_prestations: Prestation[]) {
        this.prestations = param_prestations;
        this.updateFilters();
        this.orderfilterPrestations();
    }

    orderfilterPrestations() {
        this.prestations.sort(this.orderDateDebutEtVersion);
        //this.filterVersions();
    }

    orderSelectItems(a, b) {
        return a["value"] > b["value"] ? 1 : a["value"] < b["value"] ? -1 : 0;
    }
    orderSelectItemsLabel(a, b) {
        return a["label"] > b["label"] ? 1 : a["label"] < b["label"] ? -1 : 0;
    }

    selectColumns() {

        this.cols = [];
        this.coldefs.forEach(x => {
            var addcol: boolean = true;
            // Cols depending on ID
            if (x.field == "trigramme") {
                if (this.modeCollab)
                    addcol = false;
            }
            if (x.field == "responsablePole") addcol = false;
            if (x.field == "donneurOrdre") addcol = false;
            if (x.field == "commercialOpen") addcol = false;
            if (addcol)
                Array.prototype.push.apply(this.cols, [ {header: x.header, field: x.field} ]);
        });

        this.selectedColumns = this.cols;

    }

    createColsIndex() {
        this.colsIndex = [];
        this.coldefs.forEach(x => {
            this.colsIndex[x.field]=x.header;
        });
        // Libellés collaborateur
        this.colsIndex["nom"]="Nom";
        this.colsIndex["prenom"]="Prénom";
        // Contrat
        this.colsIndex["dateDebutContrat"]="Date début";
        this.colsIndex["dateFinContrat"]="Date fin";
    }

    createStatusIndex() {
        this.allstatusidx = [];
        this.allstatus.forEach(x => {
            this.allstatusidx[x.value]=x.label;
        });
    }

    initFilters() {
        // Create filterliste
        this.coldefs.forEach(x => {
            var filteritem = (x.filtertype == "liste") ? { selected: [], values: [], keys: [], filtertype: x.filtertype, filtercond: x.filtercond, fmt: x.fmt, fmt2: x.fmt2  }
            : {selected: "", values: "", keys: [], filtertype: x.filtertype, filtercond: x.filtercond, fmt: x.fmt, fmt2: x.fmt2 };
            this.filtres[ x.field ] = filteritem;
        });
     };

    selectPrestation(event: Event, prestation: Prestation) {
        this.displayDialogPresta = true;

        this.selectedPrestation = prestation;
        if (prestation.collaborateur==undefined) // We come from collaborateur so prestation not loaded by hibernate
            this.selectedPrestation.collaborateur = this.collab;
        //this.employee = this.selectedPrestation.collaborateur;

        //event.preventDefault();
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
        //this.selectedPrestation = null;
    }

    loadAllPrestations() {
        //console.log("Prestations from db:");
        this.prestationService.list()
            .pipe(first())
            .subscribe(prestations => {
                    this.selectPrestations( prestations);
                    this.filterVersions();
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
        this.prestations.forEach(x => {

            // Retrieve trigramme if acces by table presta (done here to avoid double foreach)
            if (x.collaborateur != undefined)
                x.trigramme = x.collaborateur.trigramme;

            // Format dates
            var datearr = x.dateDebutPrestation.split("/"); //dd/mm/yyyy
            x.dateDebutPrestation = new Date(datearr[2], datearr[1]-1, datearr[0]);
            datearr = x.dateFinPrestation.split("/");
            x.dateFinPrestation = new Date(datearr[2], datearr[1]-1, datearr[0]);

            //x.dateDebutPrestationTri = this.datePipe.transform(x.dateDebutPrestation, 'yyyy-MM-dd'); //x.dateDebutPrestation.valueOf();

            // >>>> Get keys <<<<<
            for (var column in this.filtres) {
                var keyvalue = x[ column ];
                var value="";
                switch (column) {
                    case "trigramme" :
                        value = keyvalue;
                        labels[ keyvalue ] = keyvalue;
                        if (x.collaborateur != undefined)
                            labels[ keyvalue ] += " (" + x.collaborateur.nom + " " + x.collaborateur.prenom + ")";
                        break;
                    case "statutPrestation":
                        value = keyvalue;
                        break;
                }
                //if (keyvalue != undefined && keyvalue != null )
                this.filtres[ column ].keys[ keyvalue ] = value;
            }
        });

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
                        col_sort.push(key);  //console.log("coll_sort after = ", key , JSON.stringify(col_sort) );
                    }
                    col_sort.sort();

                    // Add to liste
                    for (var k in col_sort) {
                        //if ( this.filtres[column].keys.indexOf(col_sort[k])==-1)
                        var label = (column == "trigramme") ? labels[ col_sort[ k ] ] : col_sort[ k ];
                        selectitems.push({label: label, value: col_sort[ k ]});
                    }
                    break;
            }

            this.filtres[ column ].values = selectitems;
        }
    }

    loadPrestationsCollab(idemployee) {
        // Get collab info
        this.employeeService.read(idemployee).pipe(first()).subscribe(p_employee => {
            this.showCollab(p_employee);
            this.filterVersions();
        });
    }

    // Tri sur datedebut (desc) et version (desc)
    orderDateDebutEtVersion(a, b) {

        var datea = a.dateDebutPrestation;
        var dateb = b.dateDebutPrestation;

        let after  = datea > dateb ? -1 : datea < dateb ? 1 : 0;

        if (after == 0)
            after = a.versionPrestation > b.versionPrestation ? -1 : a.versionPrestation < b.versionPrestation ? 1 : 0;

        return after;
    }

    filterVersions() {
        // Si E T ou S pas d'historique, si affichage complète (E T et S) également affichage Historique si coché.

        var statushist: string[];

        // Multiselect
        var status: string[] = this.filtres[ "statutPrestation" ].selected; // this.selectedPrestas.status;

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

        this.pt.filter(status, 'statutPrestation', 'in');
    }

    pt_filter(event, pt, field: string) {
        var fld = field;
        var value = this.filtres[ field ].selected;
        if (this.filtres[ field ].filtertype == "date") {
            if (value==null) {
                valuedate=0;
                cond="gt";
            }
            else {
                var valuedate = value.valueOf(); //valuedate = event.valueOf().toString(); //valuedate = this.datePipe.transform(value, 'yyyy-MM-dd');
                var dayinmillis = 24*60*60*1000;
                var cond = this.filtres[ field ].filtercond;
                if (cond=="gte") { cond="gt";  valuedate -= dayinmillis;     }
                else if (cond=="lte") { cond="lt";  valuedate += dayinmillis;     }
            }
            this.pt.filter(valuedate, fld, cond );
        }
        else
            this.pt.filter(value, fld, this.filtres[ field ].filtercond);

    }

    //    buttons_list : String[] = ["Save","End","Delete","Cancel","Reopen"];
    buttonsFunctions(btn:string) {
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
        var referenceslist=["localisation", "numAtg", "departement","pole","domaine","responsablePole","donneurOrdre","commercialOpen"];
        this.references = []; referenceslist.forEach( ref => { this.references[ref]=[]; } );

        this.loadContrats();
        this.loadSites();
        this.loadNumAtg();
        this.loadDonneurOrdre();
        this.loadCommercialOpen();
        this.loadEquipe();    //this.loadDepartements();   //this.loadPoles();    //this.loadDomaines();
        //this.loadRespsPoles();
    }
    
    loadContrats() {
        var ref     = "contratAppli";
        var value   = "contratAppli";
        var label   = "contratAppli";

        var selectitem : SelectItem = { value: "", label: "" };

        this.references[ref]=[];
        this.contratService.list()
            .pipe(first())
            .subscribe( rows => {
                    rows.forEach( x => {
                            this.references[ref].push({ value: x[value], label: x[label] });
                        }
                    );
                    this.references[ref].sort(this.orderSelectItems);
                },
                error => { this.alertService.error(error); }
            );
    }

    loadSites() {

        var ref     = "localisation";
        var value   = "codeSite";
        var label   = "libelleSite";

        var selectitem : SelectItem = { value: "", label: "" };

        this.references[ref]=[];
        this.siteService.list()
            .pipe(first())
            .subscribe( rows => {
                    rows.forEach( x => {
                            this.references[ref].push({ value: x[value], label: x[label] });
                        }
                    );
                    this.references[ref].sort(this.orderSelectItems);
                },
                error => { this.alertService.error(error); }
            );
    }

    loadNumAtg() {

        var ref="numAtg";
        var value = "numeroAtg";
        var label= "numeroAtg";

        var selectitem : SelectItem = { value: "", label: "" };

        this.references[ref]=[];
        this.numAtgService.list()
            .pipe(first())
            .subscribe( rows => {
                    rows.forEach( x => {
                            this.references[ref].push({ value: x[value], label: x[label] });
                        }
                    );
                    this.references[ref].sort(this.orderSelectItems);
                },
                error => { this.alertService.error(error); }
            );
    }

    loadDonneurOrdre() {

        var ref="donneurOrdre";
        var value = "cleDo";
        var label= "donneurOrdre";

        var selectitem : SelectItem = { value: "", label: "" };

        this.references[ref]=[];
        this.donneurOrdreService.list()
            .pipe(first())
            .subscribe( rows => {
                    rows.forEach( x => {
                            this.references[ref].push({ value: x[value], label: x[label] });
                        }
                    );
                    this.references[ref].sort(this.orderSelectItemsLabel);
                },
                error => { this.alertService.error(error); }
            );
    }

    loadCommercialOpen() {

        var ref="commercialOpen";
        var value = "commercialOpen"; //"cleCommercialOpen";
        var label= "commercialOpen";

        var selectitem : SelectItem = { value: "", label: "" };

        this.references[ref]=[];
        this.commercialOpenService.list()
            .pipe(first())
            .subscribe( rows => {
                    rows.forEach( x => {
                            this.references[ref].push({ value: x[value], label: x[label] });
                        }
                    );
                    this.references[ref].sort(this.orderSelectItems);
                },
                error => { this.alertService.error(error); }
            );
    }

    loadEquipe() { // Département, "Pole" et Domaine
        
        var flds=["departement", "pole", "domaine" ];
        var departements=[]; var poles=[]; var domaines=[]; // Keys
        
        // Clear up list
        flds.forEach( x => { this.references[x]=[];  }   );

        this.equipeService.list()
            .pipe(first())
            .subscribe( rows => {
                
                    // Unique values
                    rows.forEach( x => {
                        departements[x['departement']] = x['departement'];
                        poles[x['pole']] = x['pole'];
                        domaines[x['domaine']] = x['domaine'];
                        }
                    );
                    
                    // Lists for combos
                    for (var item in departements) { this.references['departement'].push({ value: item, label: item } ); }
                    for (var item in poles) { this.references['pole'].push({ value: item, label: item } ); }
                    for (var item in domaines) { this.references['domaine'].push({ value: item, label: item } ); }

                    // Sort
                    flds.forEach( x => { this.references[x].sort(this.orderSelectItems); } );
                },
                error => { this.alertService.error(error); }
            );
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
