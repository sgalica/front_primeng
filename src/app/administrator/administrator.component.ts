import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {Message, SelectItem} from "primeng/api";
import {Collaborateur} from "../model/collaborateur";
import {ApiResponse} from "../model/apiresponse";
import {first} from "rxjs/operators";
import {AlertService} from "../service/alert.service";
import {Router} from "@angular/router";
import {DataService} from "../service/data.service";


@Component({
    selector: 'app-administrator',
    templateUrl: './administrator.component.html',
    styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {


    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];
    private msgs: Message[];
    private selectedfile: any;
    private viewfile: boolean;
    selectedColumns: any[];
    private apiresponse: ApiResponse;
    colsplice: any;

    constructor(private dataService: DataService, private router: Router, private alertService: AlertService) {
    }

    ngOnInit() {

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
    }


    arrayBuffer: any;
    file: File;
    all_sheet_name = new Array();
    alltable = new Array();
    columns = new Array();
    private worksheet: any;

    incomingfile(event) {
        this.file = event.target.files[0];
    }

    Upload(event) {
        //
        //
        this.file = event.files[0];

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = [];
            for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            const bstr = arr.join("");

            const workbook = XLSX.read(bstr, {type: "binary"});
            Object.keys(workbook).forEach((x, y) => {
                this.all_sheet_name.push(workbook.SheetNames[y]);
            });

            this.all_sheet_name.forEach(x => {
                    this.worksheet = workbook.Sheets[x];
                   // console.log("sheet keys ", XLSX.utils.sheet_to_json(this.worksheet, {raw: true}));
                    //this.columns.push(Object.values(XLSX.utils.sheet_to_json(this.worksheet, {raw: true})));
                    this.alltable.push(XLSX.utils.sheet_to_json(this.worksheet, {raw: true}));
                }
            );
            //const camelCase = require('camelcase');
            const camelize = require('camelize');

            this.alltable.forEach(x => {this.columns.push(Object.keys(x[0]).map(x=> camelize(x)));
                console.log("Object model ", x[0]);
            });


            console.log("liste des colonnes ", this.columns);


        };
        fileReader.readAsArrayBuffer(this.file);
    }

    saveRefTable(table : number) {
        console.log("LOGGING:::::::::::::::::::::::");
        this.dataService.registerList(this.alltable[table])
            .pipe(first())
            .subscribe(
                data  => {this.apiresponse = data as ApiResponse ;
                    console.log("data returned = ", data);
                    this.alertService.success(this.apiresponse.message);
                    this.displayDialog = false;

                    this.router.routeReuseStrategy.shouldReuseRoute = function () {
                        return false;
                    };
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });


    }

}
