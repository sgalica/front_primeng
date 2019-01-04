import {EventEmitter, Injectable, Output} from '@angular/core';
import {first} from "rxjs/operators";
import {DatePipe} from "@angular/common";

import {Collaborateur} from "../model/referentiel";
import {AlertService} from "../service/alert.service";
import {SelectItem} from "primeng/api";

@Injectable()
export class CommunATGService {

    public updateCollabCompleted$       : EventEmitter<boolean> ;
    public updateMissionCompleted$      : EventEmitter<boolean> ;
    public updatePrestationCompleted$   : EventEmitter<boolean> ;

    constructor( private datePipe : DatePipe, private alertService : AlertService ){
        this.updateCollabCompleted$     = new EventEmitter();
        this.updateMissionCompleted$    = new EventEmitter();
        this.updatePrestationCompleted$ = new EventEmitter();
    }


    // **** DATE *****

    // Intl
    fr = {
        firstDayOfWeek: 1,
        dayNames:       [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
        dayNamesShort:  [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ],
        dayNamesMin:    [ "di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
        monthNames:     [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
        monthNamesShort:[ "Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc" ],
        today:          'Aujourd\'hui',
        clear:          'Effacer'
    };

    datefmtCalendarInput = "dd/mm/yy";
    datefmt     = "dd/MM/yyyy";
    datetimefmt = "dd/MM/yyyy hh:mm:SS";

    dateStr(pDate) {
        if (pDate != undefined && pDate!=null && typeof pDate.getMonth === "function")
            return this.datePipe.transform(pDate, this.datefmt);
        return pDate;
    }

    convertStrToDate(datestr) {
        if (datestr) {
            if (typeof datestr=="string") {
                var dateArr = datestr.split("/"); //dd/mm/yyyy
                return new Date(Number(dateArr[2]), Number(dateArr[1]) - 1, Number(dateArr[0]));
            }
            else
                return datestr;
        }
        else
            return new Date(0);
    }

    datePropsToStr(item, dateFields) {
        dateFields.forEach(x => {
            if (item[x] != undefined)
                item[x] = this.dateStr(item[x]);
        } );
    }

    datePropsToDate(item, dateFields) {
        dateFields.forEach(x => {
            if (typeof item[x] == "string" )
                item[x] = this.convertStrToDate(item[x]);
        } );
    }

    dateTimeStr(pDate) {
        if (pDate != undefined && pDate!=null && typeof pDate.getMonth === "function")
            return this.datePipe.transform(pDate, this.datetimefmt);
        return pDate;
    }

    setTimeStamp(obj) {

        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Created if new
        if ( obj.createdAt == 0 ) {
            obj.createdBy = currentUser.id;
            obj.createdAt = this.dateTimeStr(new Date());
        }

        // Update
        obj.updatedBy = currentUser.id;
        obj.updatedAt = this.dateTimeStr(new Date());

    }

    // Retourne 1 si date1 >, -1 si date1<, 0 si =
    compareDates(date1Str, date2Str ) {
        var date1 = this.convertStrToDate(date1Str);
        var date2 = this.convertStrToDate(date2Str);
        return ( date1 > date2 ) ? 1 : (date1 < date2) ? -1 : 0 ;
    }

    // Retourne la date si plus récente (null autrement)
    getDateIfMoreRecent(datestr, lastDate ) {
        var dateTst = this.convertStrToDate(datestr);
        return ( dateTst > (this.convertStrToDate(lastDate)) ) ? dateTst : null;
    }

    addToDate(date, datearr) { // [d,m,y]
        var newDate = new Date(date);
        if (datearr[0] > 0)  // days
            newDate = new Date (newDate.valueOf() + (86400000 * datearr[0]) )

        if (datearr[1] > 0) { // months
            var nmonths = newDate.getMonth() + datearr[1];
            newDate = new Date (newDate.getFullYear() + (nmonths / 12), nmonths%12, newDate.getDate()  )
        }
        if (datearr[2] > 0)  // years
            newDate = new Date (newDate.getFullYear() + datearr[2], newDate.getMonth(), newDate.getDate()  )

        return newDate;
    }

    // Transforms object {cond:"gte/lte", value} => {cond:"gt/lt", value}
    convertDateGteLteToGtLt(pCondition) {

        var condition = {cond:"gt", value:0};

        if (pCondition.value != null) {
            condition.value = pCondition.value.valueOf(); //valuedate = event.valueOf().toString();
            if      (pCondition.cond=="gte") { condition.cond="gt"; condition.value -= 86400000; } // 86400000 = 1 jour en millis
            else if (pCondition.cond=="lte") { condition.cond="lt"; condition.value += 86400000; }
        }
        return condition;
    }


    // **** SelectItems ****

    orderSelectItems(a, b)      { var fld="value"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }
    orderSelectItemsLabel(a, b) { var fld="label"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }

    // Return list of SelectItems based on array et labels (if present)
    createSelectItemsFromArray(array, labels ) : any[] {
        var list=[];
        var label="";
        for (var key in array) {
            if (array[key] == "")
                label = " [ Vide ]";
            else {
                var labelfld = labels[ array[key]];
                label = (labelfld) ? labelfld : array[key] ;
            }
            list.push({label: label, value: array[key]});
        }
        return list;
    }

    // Return list of SelectItems based on table filtered on coltst
    filterTableSelectItems (tableIn:{}, coltst:string, labelfld:string) : any[] {

        var list = [];
        for( var key in tableIn) {
            if (tableIn[key][coltst])
                list.push({header: tableIn[key][labelfld], field: key});
        }
        return list;
    }

    // Return list of Selectitems based on table filtered by values in map
    filterSelectItems( tableIn:{}, arrayCheck: {} ) : any[]  {

        var list = [];
        for (var key in tableIn) {
            if ( arrayCheck[key] != undefined )
                list.push({label: tableIn[key], value: key});
        }
        return list;
    }


    // ***** Array ****

    convertMapToArray(map : {}) : any[] {
        var list=[];
        for (var key in map ) { list.push(key); }
        return list;
    }

    getLastItem(items, dateFld, versionFld) {

        var lastItem = null;
        if (items) {
            items.forEach( item => {
                var lastDate = (lastItem != null && typeof lastItem[dateFld] == "string") ? lastItem[dateFld] : null;
                var compDates = this.compareDates(item[dateFld], lastDate);
                if (compDates==1) {
                    lastItem = item;
                }
                else if ( compDates==0 ) { // Dates identiques, comparer version
                    var lastVersion = (lastItem != null) ? Number(lastItem[versionFld]) : 0;
                    if (Number(item[versionFld])>lastVersion)
                        lastItem = item;
                }
            });
        }
        return lastItem;
    }

    getItemsCond(items, fld, value ) {

        var selectedItems : any[] = null;
        if (items) {
            selectedItems = [];
            items.forEach(item => {
                if ( item[fld] == value)
                    selectedItems.push(item);
            });
        }
        return selectedItems;
    }

    getArrayItemProp(array, fldCond, valueCond, prop) {
        for ( let item of array) {
            if (item[fldCond] == valueCond)
                return (prop) ? item[prop] : item;
        }
        return null;
    }

    // **** TABLE *****

    // Initialise la propriété de la colonne selon son type (valistype si type, othervalue otherwise)
    clearTableCol(table, col, coltst, type, valistype, othervalue) {
        for( var column in table) {
            var typevalue = (table[column][coltst] == type) ? typeof valistype : typeof othervalue;
            if ( typevalue == "string")
                table[column][col]="";
            else
                table[column][col]=[];
        }
    }

    clearTableCols(colDefs, cols) {
        cols.forEach(x =>{
            var othervalue = (x=="keys") ? [] : "";
            this.clearTableCol(colDefs, x,   "filtertype", "liste", [], othervalue);

        })
    }

    // Récupère une liste dans la forme (key-value) de la table (pour combos)
    loadTableKeyValues(flds, tableService, itemsarray, uniquevalues, addEmptyValue=false) {

        tableService.list()
            .pipe(first())
            .subscribe( rows => {

                    flds.forEach( fld => {

                            itemsarray[fld.ref]=[];
                            if (addEmptyValue)
                                itemsarray[fld.ref].push({value: "", label: "[Vide]"});

                            if (uniquevalues) {

                                // Unique values
                                var keys = {};
                                rows.forEach(row => {
                                    row[fld.key] = (row[fld.key] == undefined || row[fld.key] == null) ? "" : row[fld.key].trim();
                                    keys[row[fld.key]] = row[fld.label];
                                });
                                // Lists for combos
                                for (var item in keys) {
                                    itemsarray[fld.ref].push({value: item, label: keys[item]});
                                }
                            }
                            else {
                                var label = "";
                                rows.forEach(row => {
                                    label = row[fld.label];
                                    label += (fld.labelbis) ? " (" + row[fld.labelbis] + ")" : "";

                                    itemsarray[fld.ref].push({value: row[fld.key], label: label});
                                });
                            }

                            // Sort
                            itemsarray[fld.ref].sort(this.orderSelectItems);
                        }
                    );
                },
                error => {              //this.alertService.error(error);
                }
            );
    }

    // Enregistre les valeurs des colonnes d'une ligne comme clés
    // Les valeurs undefined, null, espace comme "", Les valeurs sont débarassées de leur espaces sauf si clé.
    setKeys(colDefs, row) {

        for (var column in colDefs) {

            let property = row[column];
            let colDef   = colDefs[column];

            try {

                if (colDef.filtertype == "date") {
                }
                else if (property == undefined || property == null)
                    property = "";
                else if (colDef.keycol) {
                    let valuetrim = property.trim();
                    if (valuetrim == "") property = "";
                }
                else if (typeof property == "string")
                    property = property.trim();

                row[column] = property;
                colDefs[column].keys[ property ] = "";
            }
            catch (e) {
                debugger;
            }

        }
    }

    updateFilters(list, sortFunc, colDefs, colStatut, allstatus, dateFields=[], pCollabDef=null) {

        if (list != undefined) list.sort(sortFunc);

        // Clear
        if (colDefs)
            this.clearTableCols(colDefs, ["values", "selected", "keys"]);

        // (Trigramme, DateDebut, DateFin, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type, Statut, Version)
        var labels: {} = {};  // Labels collabs
        if (list != undefined) {
            list.forEach( row => {

                // Prestations :
                // Retrieve trigramme if acces by table presta (done here to avoid double foreach)
                if (row.collaborateur != undefined)
                    row.trigramme = row.collaborateur.trigramme;
                // Convert dateStrs to Date
                this.datePropsToDate(row, dateFields);

                // >>>> Get keys <<<<<
                this.setKeys(colDefs, row );
                var collabDef = (pCollabDef == null ) ? row : row[pCollabDef];
                this.setLabel(labels, collabDef, "trigramme",["nom", "prenom"]);

            });
        }

        for (var column in colDefs) {
            let selectitems: SelectItem[];

            switch (column) {

                case colStatut :
                    // Add labels ordered as E, T, S, A
                    selectitems = this.filterSelectItems(allstatus, colDefs[ column ].keys);
                    // Version :  // this.filtres["Version"] = {selected : "", values:[ {label: 'Historique', value: 'H'},  {label: 'Dernière', value: ''} ], keys:[] };
                    break;

                default : // trigramme, Contrat, ATG, Departement, Pole, Domaine, Site, PU, Type
                    // Sort keys
                    var colSort = this.convertMapToArray(colDefs[ column ].keys); colSort.sort();
                    // Add to filterlist
                    selectitems = this.createSelectItemsFromArray(colSort, labels );
                    break;
            }
            colDefs[column].values = selectitems;
        }
    }

    updatelist(list, action, item, rowval, colDefs, colStatut, dateFields, sortFunc, allstatus ) {

        // Replace date values in dateformat dd/mm/yyyy
        this.datePropsToStr(rowval, dateFields);
        if (action == "add") {

            list.push(rowval);
            if (colDefs)
                this.updateFilters(list, sortFunc, colDefs, colStatut, allstatus);
        }
        else if (action == "change") {
            var index=0;
            for (let row of list) {
                if (row["id"] == item["id"]) {
                    list[index] = rowval;
                    break;
                }
                index++;
            }
        }
        return list;
    }

    // ***** ELEMENTS ******

    // Rajoute les valeurs des autres colonnes comme complément d'info à la colonne dans la forme : colonne (autres colonnes)
    setLabel(labels, element, column, addlabelfields: string[] ) {

        if (element != undefined) {
            labels[ element[ column ] ] = element[ column ] ;

            var label="";
            var first=true;
            addlabelfields.forEach(fld =>  {
                if (!first) label += " ";
                label += element[fld];
                first=false;
            });
            if (label!="") label = " (" + label + ")";

            labels[ element[ column ] ] += label;
        }
    }

    // if property indicated, values of this property of the object will be set instead of obj
    setObjectValues(obj, property, newvalues) {

        for (var key in newvalues ) {
            if (property==null)
                obj[key] = newvalues[key]
            else
                obj[key][property] = newvalues[key]
        }
    }

    setSubArrayProperty(mainArray, subArray, prop, value) {
        mainArray.forEach(grp => {
            grp[subArray].forEach(fld => {
                fld[prop] = value;
            });
        });
        return mainArray;
    }

    copyObj(obj) {

        let isArray = Array.isArray(obj);
        let copy : any = (isArray) ? [] : {};
        if (isArray) { // Obj = Array
            obj.forEach(item => {
                let itemCopy = this.copyObj(item);
                copy.push(itemCopy);
            });
        }
        else { // Obj = Objet ; copy elements
            for (var attribut in obj) {
                if (typeof obj[attribut] !== "object")
                    copy[attribut] = obj[attribut];
                else if (Array.isArray(obj[attribut])) {
                    copy[attribut] = this.copyObj(obj[attribut]);
                }
            }
        }
        return copy;
    }

    updateVersion(entite, myvar, newvalue) {
        myvar.id = newvalue.id;
        myvar["statut"+entite]  = newvalue["statut"+entite];
        myvar["version"+entite] = newvalue["version"+entite];
        myvar.createdBy = newvalue.createdBy; myvar.createdAt = newvalue.createdAt;
        myvar.updatedBy = newvalue.updatedBy; myvar.updatedAt = newvalue.updatedAt;
    }

    // FORM
    setFieldValue(fieldDefsArray, pGrp, pFld, pProp, value) {

        fieldDefsArray.forEach(grp => {
            if (grp.grp == pGrp ) {
                grp.fields.forEach(fld => {
                    if (fld.name == pFld)
                        fld[pProp] = value;
                });
            }
        });
        return fieldDefsArray;
    }


    // ****** DB ******

    // Update with old value BackedUp
    // The variables and lists are actualised after successfull save,
    // and an event is triggered when treatment finished
    // if clear=true then the new (added) value is cleared (null)
    updateWithBackup(entity, upd, dbupd, add, dbadd, dbService, clear ) {

        // UPDATE
        dbService.update(dbupd).pipe(first()).subscribe(data => {
            // Update var on success
            this.updateVersion(entity, upd, data);

            // ADD
            dbadd.id = 0;
            dbService.create(dbadd).pipe(first()).subscribe(data => {

                // Update var on success
                this.updateVersion(entity, add, data);

                //if (listToBeUpdated) listToBeUpdated.push(add);
                // Clear
                if (clear) add = null;

                // Callback trigger
                if      (entity == "Mission")    this.updateMissionCompleted$.emit(add); //callbackfunc.call(callingclass);
                else if (entity == "Collab")     this.updateCollabCompleted$.emit(true);
                else if (entity == "Prestation") this.updatePrestationCompleted$.emit(true);

            }, error => { this.alertService.error("updateWithBackup("+entity+") - create : "+error); });
        },     error => { this.alertService.error("updateWithBackup("+entity+") - update : "+error); });
    }
}
