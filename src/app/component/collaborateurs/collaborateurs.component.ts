import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../../service/collaborateur.service';
import {Collaborateur} from '../../model/collaborateur';
import {NewCollaborateurComponent} from "../newCollaborateur/newCollaborateur.component";
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

    newcollaborateur : NewCollaborateurComponent;

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


        this.cols = [

            {header: 'trig_open'        , field:'trig_open'          },
            {header: 'nom'              , field:'nom'                },
            {header: 'prenom'           , field:'prenom'             },
            {header: 'tel_perso'        , field:'tel_perso'          },
            {header: 'tel_pro'          , field:'tel_pro'            },
            {header: 'mail_open'        , field:'mail_open'          },
            {header: 'mail_sg'          , field:'mail_sg'            },
            {header: 'categorisation'   , field:'code_categorisation'},
            {header: 'top_statut'       , field:'top_statut'         },
            {header: 'statut_Collab'    , field:'statut_Collab'      },
            {header: 'version_Collab'   , field:'version_Collab'     },
            {header: 'societe_stt'      , field:'societe_stt'        },
            {header: 'pre_embauche'     , field:'pre_embauche'       },
            {header: 'date_embauche'    , field:'date_embauche'      },
            {header: 'created_at'       , field:'created_at'         },
            {header: 'created_by'       , field:'created_by'         },
            {header: 'updated_at'       , field:'updated_at'         },
            {header: 'updated_by'       , field:'updated_by'         },

        ]


            this.loadAllCollaborateurs();
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

    afficherLaSaisie(event){

        // alert("lsklfkdlfkdflkdfldkf");
       // return this.newcollaborateur;
       //  event.preventDefault();

        this.displayDialog = true;
        // event.preventDefault();


    }

    saveNewCollaborateur(collaborateur : Collaborateur) {

        // alert("lsklfkdlfkdflkdfldkf");
        //creer l'objet collaborateur a partir des inputs
       this.collaborateurService.update(collaborateur);


    }

    /************************************************************************************************************/


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

            reader.onerror = function () {
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
                var csvRecord: Collaborateur = new Collaborateur();
                Object.keys(csvRecord).map(function(key, index) {csvRecord[key] = data[5]})
                //alert(csvRecord.nom);
                dataArr.push(csvRecord);

                /*                csvRecord.id = data[0]                          ;
                                csvRecord.trig_open = data[3]                   ;
                                csvRecord.nom = data[1]                         ;
                                csvRecord.prenom = data[2]                      ;
                                csvRecord.tel_perso = data[4]                   ;
                                csvRecord.tel_pro = data[5]                     ;
                                csvRecord.mail_open = data[6]                   ;
                                csvRecord.mail_sg = data[7]                     ;
                                csvRecord.code_categorisation = data[8]         ;
                                csvRecord.top_statut = data[9]                  ;
                                csvRecord.statut_Collab = data[10]              ;
                                csvRecord.version_Collab = data[11]             ;
                                csvRecord.societe_stt = data[12]                ;
                                csvRecord.pre_embauche = data[13]               ;
                                csvRecord.date_embauche = data[14]              ;
                                csvRecord.created_at = data[15]                 ;
                                csvRecord.created_by = data[16]                 ;
                                csvRecord.updated_at = data[17]                 ;
                                csvRecord.updated_by = data[18]                 ;*/

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
