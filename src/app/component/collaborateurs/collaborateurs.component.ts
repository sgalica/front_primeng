import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';
import {NewCollaborateurComponent} from "../newCollaborateur/newCollaborateur.component";
import {TableModule} from 'primeng/table';
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";

@Component({
    selector: 'app-collaborateurs',
    templateUrl: './collaborateurs.component.html',
    styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

    newcollaborateur: NewCollaborateurComponent;

    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];

    constructor(private collaborateurService: CollaborateurService, private router: Router, private alertService: AlertService ) {
    }

    ngOnInit() {

        this.cols = [
            {header: 'trig_open', field: 'trig_open'},
            {header: 'nom', field: 'nom'},
            {header: 'prenom', field: 'prenom'},
            {header: 'tel_perso', field: 'tel_perso'},
            {header: 'tel_pro', field: 'tel_pro'},
            {header: 'mail_open', field: 'mail_open'},
            {header: 'mail_sg', field: 'mail_sg'},
            {header: 'categorisation', field: 'code_categorisation'},
            {header: 'top_statut', field: 'top_statut'},
            {header: 'statut_Collab', field: 'statut_Collab'},
            {header: 'version_Collab', field: 'version_Collab'},
            {header: 'societe_stt', field: 'societe_stt'},
            {header: 'pre_embauche', field: 'pre_embauche'},
            {header: 'date_embauche', field: 'date_embauche'},
            {header: 'created_at', field: 'created_at'},
            {header: 'created_by', field: 'created_by'},
            {header: 'updated_at', field: 'updated_at'},
            {header: 'updated_by', field: 'updated_by'},

        ]


        this.loadAllCollaborateurs();
    }


    loadAllCollaborateurs() {
        this.collaborateurService.getAll().pipe(first()).subscribe(collaborateurs => {
            this.collaborateurs = collaborateurs;
        });
    }

    afficherLaSaisie(event) {
        this.displayDialog = true;
    }

    saveNewCollaborateur() {
        console.log("LOGGING:::::::::::::::::::::::");
        this.collaborateurService.registerList(this.importedCollabs)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(["/collaborateurs"]);
                },
                error => {
                    this.alertService.error(error);
                });


    }

    /************************************************************************************************************/


    public csvRecords: any[] = [];
    public importedCollabs: Collaborateur[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;
    externalFiles: any;
    uploadedFiles: any[] = [];


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

    getDataRecordsArrayFromCSVFile(rows) {
        // on retire les noms de colonnes
        var keys = rows.shift().split(",");
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
}
