import {Component, OnInit} from '@angular/core';
import {read, utils} from 'xlsx';
import {Message, SelectItem} from "primeng/api";
import {ApiResponse} from "../model/apiresponse";
import {first} from "rxjs/operators";
import {AlertService} from "../service/alert.service";
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {User} from "../model/user";
import {AtgModel, Collaborateur, Referentiel} from "../model/referentiel";
import {DataService} from "../service/data.service";
import {MissionService, ReferentielService} from "../service/datas.service";

class Resource {
    id: number
}

@Component({
    selector: 'app-administrator',
    templateUrl: './administrator.component.html',
    styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

    value: number = 0;

    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;
    resetRef: boolean;
    loader: boolean[] = [false];
    loaderImport: boolean;
    clearRef: boolean;

    sortOptions: SelectItem[];

    cols: any[];

    allUsers: User[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];
    selectedColumns: any[];
    colsplice: any;
    arrayBuffer: any;
    file: File;
    all_sheet_name = [];
    alltable = [];
    columns = [];
    allUsersCols: string[];
    myjson: any = JSON;
    private msgs: Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private apiresponse: ApiResponse;
    private worksheet: any;

    constructor(private router: Router,
                private dataService: DataService,
                private userService: UserService,
                private missionService: MissionService,
                private referentielService: ReferentielService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.resetRef = true;


        const camelCase = require('camelcase');

        this.cols = [
            {header: 'trig_open', field: camelCase('trig_open')},
            {header: 'nom', field: camelCase('nom')},
            {header: 'prenom', field: camelCase('prenom')},
            {header: 'tel_perso', field: camelCase('tel_perso')},
            {header: 'tel_pro', field: camelCase('tel_pro')},
            {header: 'mail_open', field: camelCase('mail_open')},
            {header: 'mail_sg', field: camelCase('mail_sg')},
            {header: 'categorisation', field: camelCase('code_categorisation')},
            {header: 'top_statut', field: camelCase('top_statut')},
            {header: 'statut_Collab', field: camelCase('statut_Collab')},
            {header: 'version_Collab', field: camelCase('version_Collab')},
            {header: 'societe_stt', field: camelCase('societe_stt')},
            {header: 'pre_embauche ', field: camelCase('pre_embauche')},
            {header: 'date_embauche', field: camelCase('date_embauche')},
            {header: 'created_at', field: camelCase('created_at')},
            {header: 'created_by', field: camelCase('created_by')},
            {header: 'updated_at', field: camelCase('updated_at')},
            {header: 'updated_by', field: camelCase('updated_by')}

        ];

        console.log(this.selectedColumns);

        this.selectedColumns = [
            {header: 'trig_open', field: camelCase('trig_open')},
            {header: 'nom', field: camelCase('nom')},
            {header: 'prenom', field: camelCase('prenom')},
            {header: 'tel_perso', field: camelCase('tel_perso')},
            {header: 'tel_pro', field: camelCase('tel_pro')},
            {header: 'mail_open', field: camelCase('mail_open')},
            {header: 'mail_sg', field: camelCase('mail_sg')},
            {header: 'categorisation', field: camelCase('code_categorisation')},
            {header: 'top_statut', field: camelCase('top_statut')},
            {header: 'statut_Collab', field: camelCase('statut_Collab')},
            {header: 'version_Collab', field: camelCase('version_Collab')}
        ];

        this.getAllUsers();
        console.log("La liste des users", this.allUsers);
    }

    getAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(
                data => {
                    this.allUsers = data;
                    this.allUsersCols = Object.keys(data[0]);
                    console.log(this.allUsersCols);
                },
                error => {
                    this.alertService.error(error);
                });
    }


    incomingfile(event) {
        this.file = event.target.files[0];
    }

    loading() {
        this.loaderImport = true;

    }

    Upload(event) {

        this.file = event.files[0];

        let fileReader = new FileReader();


        fileReader.onload = (e) => {

            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = [];
            for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            const bstr = arr.join("");
            // console.log("xls", bstr);

            const workbook = read(bstr, {type: "binary", cellDates: true, dateNF: 'dd/mm/yyyy;@'});
            console.log("workbook", workbook);

            /*           Object.keys(workbook).forEach((x, y) => {
                           this.all_sheet_name.push(workbook.SheetNames[y]);
                       });  */

            this.all_sheet_name = workbook.SheetNames;
            console.log("all_sheet_name", this.all_sheet_name);


            this.all_sheet_name.forEach(x => {
                    this.worksheet = workbook.Sheets[x];
                    // console.log("sheet keys ", XLSX.utils.sheet_to_json(this.worksheet, {raw: true}));
                    //this.columns.push(Object.values(XLSX.utils.sheet_to_json(this.worksheet, {raw: true})));
                    this.alltable.push(utils.sheet_to_json(this.worksheet, {
                        raw: false,
                        defval: null,
                        blankrows: false,
                        dateNF: 'dd/mm/yyyy;@'
                    }));
                }
            );
            console.log("alltable", this.alltable);

            const camelize = require('camelcase-object-deep');
            // const camelize = require('camelcase-keys');
            //const camelCase = require('camel-case');
            const camelCase = require('camelize');
            var changeCase = require('change-case');


            var temp = [];

            // formate le nom des colonnes au format Camel
            this.alltable.forEach(x => {

                temp.push(Object.values(x)
                    .map((y) => {
                        console.log("avant mutation", JSON.stringify(y));
                        //if(y==0)x.forEach((a,i)=> {if(i==0) Object.defineProperty(Object.prototype,'id',)})

                        Object.keys(y).map((id, i) => {
                            if (i == 0) {
                                y[`id`] = y[id];
                                //delete y[id];
                            }
                            /*if (!(/^[a-zA-Z0-9_]*$/.test(y[id])) || /null/.test(y[id])) {
                                console.log("a supprimer", JSON.stringify(y[id]));

                                delete y[id];
                                delete y[`id`];
                            }*/
                        });


                        console.log("aprés mutation", y);


                        return camelize(y);

                    })
                );

                // formate le nom des colonnes au format Camel
                //Object.keys(x[ 0 ]).map(y => camelize(y));
                // this.columns.push(Object.keys(x[0]).map((z) => {
                //     return changeCase.camelCase(z);
                // }));
            });
            console.log("Avant camel", temp);

            temp.forEach(x =>
                this.columns.push(Object.keys(x[0])));

            console.log("Object model camelized ", temp);
            console.log("Object model standard", this.alltable);
            console.log("liste des colonnes ", this.columns);
            // on met a jour l'objet avec des colonnes camelisées
            this.alltable = temp;

            //this.loaderImport=false;

        };

        fileReader.readAsArrayBuffer(this.file);
        fileReader.onloadend = (e) => {
            this.loaderImport = false
        };
        fileReader.removeEventListener = (e) => {
            this.loaderImport = false
        };

        fileReader.onerror = (e) => {
            this.loaderImport = false;

            this.alertService.error("Une erreur s'est produite");
        };
        this.resetRef = false;

    }

    getModelMatch(T) {

        /* T = {
             contrat: "ATG-000111",
             dateMaj: 36526,
             dateCreation: 36526,
             numeroAtg: "ATG-000666-0",
             trigrammeMaj: "SBA16490",
             trigrammeCreation: "SBA16490"
         };*/
        console.log("Objet a tester", T[0]);

        //var constructor;
        let modelList = new AtgModel();
        let obj = null;

        for (let x of Object.values(modelList)) {

            console.log(modelList);
            console.log(x);
            console.log(x[0]);
            const temp = new x.constructor;

            const acc = Object.entries(T[0]).reduce((accumulator, currentValue) => {
                console.log("Object to test", x);
                console.log("currentValue = ", currentValue[0]);
                console.log("accumulator = ", accumulator);

                if (accumulator && x.hasOwnProperty(currentValue[0])) {

                    return x.hasOwnProperty(currentValue[0]);
                }
                else {
                    return false;
                }


            }, true);

            console.log("accumulateur", acc);
            // On arrete la recherche du model si un des models match avec l'objet JSON
            if (acc) {
                obj = temp;
                console.log("This Object match with model : ", obj);
                break;
            }

            console.log("name of the property", x);
        }
        return obj;
    }

    convertJsonToModel(object: any, model: any) {
        const jsonToConvert = [];
        Object.values(object).forEach(x => {


            const temp = new model.constructor;

            const acc = Object.entries(x).forEach((currentValue) => {
                // console.log(x.hasOwnProperty(currentValue));
                console.log("currentValue = ", currentValue[0]);
                if (currentValue[1] === undefined) currentValue[1] = null;

                Object.defineProperty(temp, currentValue[0], {
                    writable: false,
                    value: currentValue[1]
                });
                // obj.constructor.argumentscurrentValue[0] = T.currentValue[1];

                console.log("notre nouvel obj = ", temp);


            });

            jsonToConvert.push(temp);


        });

        console.log("convertedJson = ", jsonToConvert);

        //jsonToConvert.splice(-1, 1);
        console.log("convertedJson = ", jsonToConvert);

        return jsonToConvert;
    }


    cleanAllTable() {
        this.clearRef = true;

        this.referentielService.deleteAll()
            .pipe(first())
            .subscribe(
                data => {
                    this.apiresponse = data as ApiResponse;
                    console.log("data returned = ", data);
                    this.alertService.success(this.apiresponse.message);
                    this.displayDialog = false;
                    this.clearRef = false;

                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    };
                },
                error => {
                    this.clearRef = false;

                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });

    }


    saveAllRefTable(referentiel: any) {
        this.loaderImport = true;

        let convertedJson = referentiel;
        let cons = new Referentiel();

        this.dataService.getServiceMatch(cons).create(convertedJson)
        //this.missionService.createList(convertedJson)
            .pipe(first())
            .subscribe(
                data => {
                    this.value = data;
                    this.apiresponse = data as ApiResponse;
                    console.log("data returned = ", data);
                    this.alertService.success(this.apiresponse.message);
                    this.displayDialog = false;
                    this.loaderImport = false;

                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    };
                },
                error => {
                    this.loaderImport = false;

                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });


    }

    saveRefTable(event: any, table: any, i: any) {
        this.loader[i] = true;

        // permet d'empecher la propagation de l'evenement click pour que l'accordeon ne qouvre pas apres appuis sur le bouton
        event.stopPropagation();
        event.preventDefault();
        let cons = null;

        let convertedJson: any;
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",         table);
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

        if(table.length>0){
         cons = this.getModelMatch(table);
        }
        if (cons) {
            console.log("LOGGING table:::::::::::::::::::::::", table);
            console.log("LOGGING cons :::::::::::::::::::::::", cons);
            convertedJson = this.convertJsonToModel(table, cons);
            const temp = convertedJson.map(x => JSON.stringify(x));
            console.log("LOGGING convertedJson :::::::::::::::::::::::", convertedJson);
            console.log("LOGGING temp :::::::::::::::::::::::", temp);


            // const temp = this.serviceMatcher.getServiceMatch(cons);
            //console.log("LOGGING res :::::::::::::::::::::::", res);
            //this.ReferentielService.createList(convertedJson)

            this.dataService.getServiceMatch(cons).createList(convertedJson)
            //this.missionService.createList(convertedJson)
                .pipe(first())
                .subscribe(
                    data => {
                        this.apiresponse = data as ApiResponse;
                        console.log("data returned = ", data);
                        this.alertService.success(this.apiresponse.message);
                        this.displayDialog = false;

                        this.loader[i] = false;
                        this.router.routeReuseStrategy.shouldReuseRoute = function () {
                            return false;
                        };
                    },
                    error => {
                        this.loader[i] = false;

                        console.log("data returned = ", error);

                        this.alertService.error(error);
                    });

        }
        else if (cons == null) {
            this.alertService.error("Le format de donnée n'est pas geré");
            this.loader[i] = false;
        }

    }

}
