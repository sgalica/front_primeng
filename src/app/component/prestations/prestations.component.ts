import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../../service/alert.service";
import {DataTable} from "primeng/primeng";
import {Collaborateur, CommercialOpen, Contrat, Mission, Prestation} from "../../model/referentiel";
import {CommercialOpenService, ContratService, DonneurOrdreService, EquipeService, NumAtgService, PrestationService, SiteService} from "../../service/datas.service";
import {CommunATGService} from "../../service/communATG.service";
import {ConfirmationService} from "primeng/api";

//this.prestations=this.communServ.updatelist(this.prestations, action, item, new Prestation(item), this.coldefs, "statutPrestation", ["dateDebutPrestation","dateFinPrestation"], this.orderDateDebutEtVersion, this.allstatus);

@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: [ './prestations.component.css' ],
    providers : [ConfirmationService]
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
    selectedPrestationOriginalValue : Prestation;
    displayDialogPresta: boolean = false;

    // Références
    missions : { label: string, value: number }[];
    allstatus = { E : "En cours", T: "Terminée", S: "Supprimée", A: "Archivée" };
    contrats : SelectItem[]=[];
    references : any[]=[];

    showHistSelect: boolean = false;

    buttonsList : String[] = ["Save", "End", "Delete", "Cancel", "Reopen"];
    buttons : Object; // {label:String, disabled:Boolean}[] = []

    FieldsFiches : any[];

    communServ : CommunATGService;
    styleObligatoire : string = "obligatoire";
    styleReadOnly    : string = "readonly";

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
        // private respPoleService: Service,

        private router: Router, private route: ActivatedRoute,
        private alertService: AlertService,
        private communATGService : CommunATGService,
        private confirmationService : ConfirmationService
    ) {
        communATGService.updateCompleted$.subscribe(x => this.onUpdateMissionCompleted(x));
    }


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
            trigramme :             {header: 'Identifiant Pilote',  filtertype: "liste", showInList:true,  filtercond: null,  selected: ["testclear","testclearbis" ], values:[], keys:{}, keycol:true},
            dateDebutPrestation :   {header: 'Début',               filtertype: "date",  showInList:true,  filtercond: "gte", selected: "", values:"", keys:{}, keycol:false},
            dateFinPrestation :     {header: 'Fin',                 filtertype: "date",  showInList:true,  filtercond: "lte", selected: "", values:"", keys:{}, keycol:false},
            contratAppli :          {header: 'Contrat',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            numAtg:                 {header: 'ATG',                 filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            departement:            {header: 'Département',         filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            pole:                   {header: 'Pôle',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            domaine:                {header: 'Domaine',             filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            localisation:           {header: 'Site',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            numeroPu:               {header: 'PU',                  filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            responsablePole:        {header: 'Responsable de pôle', filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            donneurOrdre:           {header: 'Donneur ordre SG',    filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            topAtg:                 {header: 'Type',                filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            statutPrestation:       {header: 'Statut',              filtertype: "liste", showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},
            commercialOpen:         {header: 'Nom prénom',          filtertype: "liste", showInList:false, filtercond: null,  selected: [], values:[], keys:{}, keycol:true},
            versionPrestation:      {header: 'Version',             filtertype: "",      showInList:true,  filtercond: null,  selected: [], values:[], keys:{}, keycol:false},

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

        this.FieldsFiches=[
            {grp: "collaborateur",  grplabel : "Prestataire",
                fields :   [{name:"trigramme",      type:"field", obligatoire:"", readonly:true},                 {name:"nom",                 type:"field", obligatoire:"", readonly:true},                  {name:"prenom",             type:"field", obligatoire:"", readonly:true}]},
            {grp: "contrat",        grplabel : "Contrat",
                fields :   [{name:"contratAppli",   type:"combo", obligatoire:"", readonly:false, editable:false}, {name:"dateDebutContrat",    type:"date", obligatoire:"", readonly:false},                   {name:"dateFinContrat",     type:"date", obligatoire:"", readonly:false}]},
            {grp: "Prestation",     grplabel : "Prestation",
                fields :   [{name:"localisation",   type:"combo", obligatoire:"", readonly:false, editable:false}, {name:"numAtg",              type:"combo", obligatoire:"", readonly:false, editable:false},
                            {name:"departement",    type:"combo", obligatoire:"", readonly:false, editable:false}, {name:"pole",                type:"combo", obligatoire:"", readonly:false, editable:false},  {name:"domaine",            type:"combo", obligatoire:"", readonly:false, editable:false},
                            {name:"numeroPu",       type:"field", obligatoire:"", readonly:false},                 {name:"dateDebutPrestation", type:"date", obligatoire:"", readonly:false},                   {name:"dateFinPrestation",  type:"date", obligatoire:"", readonly:false},
                            {name:"responsablePole",type:"combo", obligatoire:"", readonly:false, editable:true},
                            {name:"donneurOrdre",   type:"combo", obligatoire:"", readonly:false, editable:false}]},
            {grp: "commercialOpenInfo", grplabel : "Commercial OPEN",
                fields :   [{name:"commercialOpen", type:"combo", obligatoire:"", readonly:false, editable:false}, {name:"adresseMail",         type:"field", obligatoire:"", readonly:false},                  {name:"telephonePortable",  type:"field", obligatoire:"", readonly:false},      {name:"telephoneFixe", type:"field", obligatoire:"", readonly:false} ] }
        ];

        this.displayDialogPresta = false;

        this.buttons = {
            "Save"   : {label:"Enregistrer", disabled:true,  fnc : ()=>{this.save();} },
            "End"    : {label:"Terminer",    disabled:true,  fnc : ()=>{this.end();} },
            "Delete" : {label:"Supprimer",   disabled:false, fnc : ()=>{this.suppPrestation();} },
            "Cancel" : {label:"Annuler",     disabled:true,  fnc : ()=>{this.cancel();} },
            "Reopen" : {label:"Ré-ouvrir la prestation", disabled:true,  fnc : ()=>{this.save();} }
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
                if (colval.field == "trigramme")
                    this.selectedColumns.splice(pos, 1);
                else
                    pos++;
            });
        }

        this.cols = this.selectedColumns;
    }

    loadAllPrestations() {

        this.prestationService.list().pipe(first()).subscribe(prestations => {
            this.selectPrestations(prestations);
            this.filterVersions();
            // RespsPole : If all prestations loaded, we can take values from filters
            var ref = "responsablePole";
            Array.prototype.push.apply(this.references[ref], this.coldefs[ref].values);
            //this.alertService.success(prestations);
        },error => { this.alertService.error(error); });
    }

    selectPrestations(p_prestations: Prestation[]) {

        this.prestations = p_prestations;
        this.communServ.updateFilters(this.prestations, this.orderDateDebutEtVersion, this.coldefs, "statutPrestation", this.allstatus, ["dateDebutPrestation", "dateFinPrestation"], "collaborateur" );
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
            condition = this.communServ.convertDateGteLteToGtLt(condition);

        this.pt.filter(condition.value, field, condition.cond);
    }

    manageFieldsFiche(action, state) {

        var fieldsFiches : any[] = this.FieldsFiches;
        // To do : evt  adapte if not same for fields with creation
        //var fieldsFiches : any[] = (action=="Visu") ? this.FieldsFichesVisu : this.FieldsFichesCreation;
        // Make fields readonly if state "Terminée"

        if (state=="T")
            fieldsFiches = this.communServ.setSubArrayProperty(fieldsFiches, "fields", "readonly", true);

        return fieldsFiches;
    }

    selectPrestation(event: Event, prestation: Prestation) {

        this.selectedPrestation              = new Prestation(prestation);
        this.selectedPrestationOriginalValue = new Prestation(prestation);

        // We come from collaborateur so collab of prestation not loaded by hibernate
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

        var statut = this.getStatut(this.selectedPrestation.statutPrestation);

        this.FieldsFiches = this.manageFieldsFiche(action, this.selectedPrestation.statutPrestation );

        // Buttons
        this.communServ.setObjectValues(this.buttons, "disabled",{
            Save        : !statut.activeOrNew,         // Ne pas Enregistrer si :
            ReOpen      : statut.activeOrNew,          // Ne pas Réactiver si : Actif ou Nouveau
            Cancel      : false } );
    }

    new() {
        // Create empty item
        this.selectedPrestation = new Prestation();

        // Set default values

        // Show form
        this.displayDialogPresta = true;
        this.afficherLaSaisie("New");
    }

    checkInput(item) {
        var errmsg="";
        // Do check here
        return errmsg;
    }

    save() { // On save do add or update
        var item = this.selectedPrestation;
        // CHECK input
        var errmsg = this.checkInput(item);
        var result = "";
        if (errmsg=="") {
            // ADD new value
            if (item.id == 0) {
                var newItem = new Prestation(item);
                this.communServ.setObjectValues(newItem, null, {
                    // Set State to "En cours" Version "1"
                    statutPrestation : "E", versioPrestation : 1,
                    dateDebutPrestation : this.communServ.dateStr(item.dateDebutPrestation),
                    dateFinPrestation : this.communServ.dateStr(item.dateFinPrestation)
                });
                this.add(newItem);
            }
            // UPDATE
            else {
                // TO DO !!!!
                //this.update("E");
                // Evt. Update related edited tables
            }
        }
        else this.alertService.error(errmsg);
    }

    cancelEditPresta() {
        if (this.selectedPrestation.id == 0)
            this.new();
        else
            this.selectPrestation(null, this.selectedPrestationOriginalValue);
    }


    add(itemfordb) {
        this.communServ.setTimeStamp(itemfordb);
        this.prestationService.create(itemfordb).pipe(first()).subscribe(data => {

            let list = "prestations";
            let entity = "Prestation";
            var item = this.selectedPrestation;
            // Update item on success
            this.communServ.updateVersion(entity, item, data);

            var newItem = new Prestation(item);

            // Update list
            this[list] = this.communServ.updatelist( this[list],"add", item,
                newItem, this.coldefs, "statut"+entity,["dateEmbaucheOpen"], this.orderDateDebutEtVersion, this.allstatus );

            // Actual value becomes original value
            this.selectedPrestationOriginalValue = newItem;

            this.alertService.success("Enregistré");
            this.afficherLaSaisie("Visu");
        }, error => { this.alertService.error(error); });
    }

    // !! Also called from collab :
    update(entity : string, action : string, item : Prestation, dbService : PrestationService, listToBeUpdated) {

        if (item==undefined || item==null) return;

        // Old value
        var dbold = new Prestation(item); this.communServ.setObjectValues(dbold, null, { statutPrestation: "A",
            dateDebutPrestation : this.communServ.dateStr(dbold.dateDebutPrestation), dateFinPrestation : this.communServ.dateStr(dbold.dateFinPrestation )
        } );
        // New value
        var dbnew = new Prestation(item); this.communServ.setObjectValues(dbnew, null, { statutPrestation : action,  // "T"
            versionPrestation : Number(dbnew.versionPrestation) + 1,
            dateDebutPrestation : this.communServ.dateStr(dbnew.dateDebutPrestation), dateFinPrestation : this.communServ.dateStr(dbnew.dateFinPrestation )
        });

        var dbupd  = dbold; var upd = item;
        var dbadd  = dbnew; var add = new Prestation(item); // Item not changed with add value
        this.communServ.updateWithBackup(entity, upd, dbupd, add, dbadd, dbService, false, listToBeUpdated, null );

    }

    delete() {
        this.selectedPrestation.statutPrestation = (this.selectedPrestation.statutPrestation == "S") ? "E" : "S";
        this.prestationService.delete(this.selectedPrestation.id).pipe(first()).subscribe(data => {          },
                error => { this.alertService.error(error);  });
    }

    end() { }
    cancel() { }

    suppPrestation(item=null) {

        this.confirmationService.confirm({
            message: "Confirmez-vous la suppression ?",
            accept: () => {

                if (item) this.selectPrestation(null, item);
                // ToDo
               // this.update("S");
            }
        });
    }

    onUpdateMissionCompleted(param) {
       // this.lastMission = null;
    }


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
