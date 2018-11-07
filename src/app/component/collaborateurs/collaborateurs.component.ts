import {Component, OnInit, ViewChild} from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {ApiResponse} from "../../model/apiresponse";
import {Collaborateur} from "../../model/referenciel";
import {CollaborateurService} from "../../service/datas.service";


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
    collaborateur: Collaborateur;
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
            {header: 'Trigramme OPEN', field: camelCase('trigramme')},
            {header: 'Nom', field: camelCase('nom')},
            {header: 'Prenom', field: camelCase('prenom')},
            {header: 'Tel perso', field: camelCase('tel_perso')},
            {header: 'Tel pro', field: camelCase('tel_pro')},
            {header: 'Mail OPEN', field: camelCase('mail_open')},
            {header: 'Mail SG', field: camelCase('mail_sg')},
            {header: 'Catégorie', field: camelCase('code_categorisation')},
            {header: 'Sous-traitance', field: camelCase('stt')},
            {header: 'Societe sous-traitance', field: camelCase('societe_stt')},
            {header: 'Statut', field: camelCase('statut_Collab')},
            {header: 'Version', field: camelCase('version_Collab')},
            {header: 'Pré-embauche ', field: camelCase('pre_embauche')},
            {header: 'Date d\'embauche', field: camelCase('date_embauche_open')},
            {header: 'Date de création', field: camelCase('created_at')},
            {header: 'Créé par', field: camelCase('created_by')},
            {header: 'Date de mise a jour', field: camelCase('updated_at')},
            {header: 'Modifié par', field: camelCase('updated_by')}

        ];

        console.log(this.selectedColumns);

        this.selectedColumns = [
            {header: 'Trigramme', field: camelCase('trigramme')},
            {header: 'Nom', field: camelCase('nom')},
            {header: 'Prenom', field: camelCase('prenom')},
            {header: 'Tel perso', field: camelCase('tel_perso')},
            {header: 'Tel pro', field: camelCase('tel_pro')},
            {header: 'Mail OPEN', field: camelCase('mail_open')},
            {header: 'Mail SG', field: camelCase('mail_sg')},
            {header: 'categorisation', field: camelCase('code_categorisation')},
            {header: 'Sous-traitance', field: camelCase('top_statut')},
            {header: 'Statut', field: camelCase('statut_Collab')},
            {header: 'Version', field: camelCase('version_Collab')}
        ];
        // this.colsplice = this.selectedColumns;
        // this.colsplice.splice(1,10);
    }


    loadAllCollaborateurs() {

        this.collaborateurService.list()
            .pipe(first())
            .subscribe(
                collaborateurs => {
                    console.log("data returned = ", collaborateurs);

                    this.collaborateurs = collaborateurs;
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
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
                data => {
                    this.apiresponse = data as ApiResponse;
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
