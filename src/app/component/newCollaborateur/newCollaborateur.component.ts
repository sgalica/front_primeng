import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';

@Component({
    selector: 'app-newCollaborateur',
    templateUrl: './newCollaborateur.component.html',
    styleUrls: ['./newCollaborateur.component.css']
})
export class NewCollaborateurComponent implements OnInit {


    collaborateur : Collaborateur;

    selectedCollaborateur: Collaborateur;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    cols: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];

    constructor( private collaborateurService: CollaborateurService) { }

    ngOnInit() {

        this.sortOptions = [
            {label: 'Newest First', value: '!nom'},
            {label: 'Oldest First', value: 'prenom'},
            {label: 'Brand', value: 'brand'}
        ];
        this.cols = [

            {header: 'id_pilot', field:'id_pilot'},
            {header: 'nom', field:'nom'},
            {header: 'prenom', field:'prenom'},
            {header: 'trig_open', field:'trig_open'},
            {header: 'tel_perso', field:'tel_perso'},
            {header: 'tel_pro', field:'tel_pro'},
            {header: 'mail_open', field:'mail_open'},
            {header: 'mail_sg', field:'mail_sg'},
            {header: 'categorisation', field:'code_categorisation'},
            {header: 'top_statut', field:'top_statut'},
            {header: 'statut', field:'statut'},

        ]

        this.loadAllCollaborateurs();
        this.saveNewCollaborateur(this.collaborateur);
    }

    selectCollaborateur(event: Event, collaborateur: Collaborateur) {
        this.selectedCollaborateur = collaborateur;
        this.displayDialog = true;
        event.preventDefault();
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onDialogHide() {
        this.selectedCollaborateur = null;
    }

    loadAllCollaborateurs() {
        this.collaborateurService.getAll().pipe(first()).subscribe(collaborateurs => {
            this.collaborateurs = collaborateurs;
        });
    }

    saveNewCollaborateur(collaborateur : Collaborateur) {

        this.collaborateurService.update(collaborateur);


    }


    title = 'app';
    public csvRecords: any[] = [];

    @ViewChild('fileImportInput') fileImportInput: any;


    fileChangeListener($event: any): void {

        var text = [];
        var files = $event.srcElement.files;

        if (this.isCSVFile(files[0])) {

            var input = $event.target;
            var reader = new FileReader();
            reader.readAsText(input.files[0]);

            reader.onload = (data) => {
                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r\n|\n/);

                let headersRow = this.getHeaderArray(csvRecordsArray);

                this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            }

            reader.onerror = function() {
                alert('Unable to read ' + input.files[0]);
            };

        } else {
            alert("Please import valid .csv file.");
            this.fileReset();
        }
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        var dataArr = []

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(',');

            // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
            // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
            if (data.length == headerLength) {

                var csvRecord: CSVRecord = new CSVRecord();

                csvRecord.firstName = data[0].trim();
                csvRecord.lastName = data[1].trim();
                csvRecord.email = data[2].trim();
                csvRecord.phoneNumber = data[3].trim();
                csvRecord.title = data[4].trim();
                csvRecord.occupation = data[5].trim();

                dataArr.push(csvRecord);
            }
        }
        return dataArr;
    }

    // CHECK IF FILE IS A VALID CSV FILE
    isCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }

    // GET CSV FILE HEADER COLUMNS
    getHeaderArray(csvRecordsArr: any) {
        let headers = csvRecordsArr[0].split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    fileReset() {
        this.fileImportInput.nativeElement.value = "";
        this.csvRecords = [];
    }

}

export class CSVRecord{

    public firstName: any;
    public lastName: any;
    public email: any;
    public phoneNumber: any;
    public title: any;
    public occupation: any;

    constructor()
    {

    }

}
