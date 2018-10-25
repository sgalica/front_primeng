import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/collaborateur2.service';
import {Collaborateur} from '../../model/collaborateur';
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {ApiResponse} from "../../model/apiresponse";


@Component({
    selector: 'app-collaborateurs',
    templateUrl: './collaborateurs.component.html',
    styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {


    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];
    collaborateur : Collaborateur;
    private msgs: Message[];
    private selectedfile: any;
    private viewfile: boolean;
    private columns: any;
     selectedColumns: any[];
    private apiresponse: ApiResponse;
    colsplice: any;

    constructor(private collaborateurService: CollaborateurService,
                private router: Router,
                private alertService: AlertService) {
    }


    ngOnInit() {

        const camelCase = require('camelcase');
        this.loadAllCollaborateurs();

        this.cols = [
            {header: 'trig_open'      , field: camelCase('trig_open')},
            {header: 'nom'            , field: camelCase('nom')},
            {header: 'prenom'         , field: camelCase('prenom')},
            {header: 'tel_perso'      , field: camelCase('tel_perso')},
            {header: 'tel_pro'        , field: camelCase('tel_pro')},
            {header: 'mail_open'      , field: camelCase('mail_open')},
            {header: 'mail_sg'        , field: camelCase('mail_sg')},
            {header: 'categorisation' , field: camelCase('code_categorisation')},
            {header: 'top_statut'     , field: camelCase('top_statut')},
            {header: 'statut_Collab'  , field: camelCase('statut_Collab')},
            {header: 'version_Collab' , field: camelCase('version_Collab')},
            {header: 'societe_stt'    , field: camelCase('societe_stt')},
            {header: 'pre_embauche '  , field: camelCase('pre_embauche')},
            {header: 'date_embauche'  , field: camelCase('date_embauche')},
            {header: 'created_at'     , field: camelCase('created_at')},
            {header: 'created_by'     , field: camelCase('created_by')},
            {header: 'updated_at'     , field: camelCase('updated_at')},
            {header: 'updated_by'     , field: camelCase('updated_by')}

        ];

        console.log(this.selectedColumns);

        this.selectedColumns = [
            {header: 'trig_open'      , field: camelCase('trig_open')},
            {header: 'nom'            , field: camelCase('nom')},
            {header: 'prenom'         , field: camelCase('prenom')},
            {header: 'tel_perso'      , field: camelCase('tel_perso')},
            {header: 'tel_pro'        , field: camelCase('tel_pro')},
            {header: 'mail_open'      , field: camelCase('mail_open')},
            {header: 'mail_sg'        , field: camelCase('mail_sg')},
            {header: 'categorisation' , field: camelCase('code_categorisation')},
            {header: 'top_statut'     , field: camelCase('top_statut')},
            {header: 'statut_Collab'  , field: camelCase('statut_Collab')},
            {header: 'version_Collab' , field: camelCase('version_Collab')}
            ];
        // this.colsplice = this.selectedColumns;
        // this.colsplice.splice(1,10);
    }



    loadAllCollaborateurs() {

        this.collaborateurService.list().pipe(first()).subscribe(collaborateurs => {
            this.collaborateurs = collaborateurs;
        });
    }

    afficherLaSaisie(event) {
        this.displayDialog = true;
    }

    saveNewCollaborateur() {
        console.log("LOGGING:::::::::::::::::::::::");
        this.collaborateurService.createList(this.importedCollabs)
            .pipe(first())
            .subscribe(
                data  => {
                    this.apiresponse = data as ApiResponse ;
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

    /************************************************************************************************************/


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
        keys = keys.map(x =>  camelCase(x));

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
