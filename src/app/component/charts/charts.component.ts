import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {PrestationService} from "../../service/datas.service";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {Prestation} from "../../model/referenciel";
import {Subject} from "rxjs/Rx";

export class ChartLine {

    constructor(departement: any, tauxStt: any, nombreColl: any, dateRef: any) {
        this.departement = departement;
        this.tauxStt = tauxStt;
        this.nombreColl = nombreColl;
        this.dateRef = dateRef;
    }

    departement: any = 0;
    tauxStt: any = 0;
    nombreColl: any = 0;
    dateRef: any = 0;
}

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

    lineData: any;

    barData: any;

    allchartsSub = new Subject<ChartLine[]>();
    allcharts = [];


    monthList = [];


    pieData: any;

    polarData: any;

    radarData: any;
    private prestations: Prestation[];

    constructor(private prestationService: PrestationService,
                private router: Router,
                private alertService: AlertService) {
        this.loadAllPrestations();

    }


    ngOnInit() {

        var formatter = new Intl.DateTimeFormat("fr", {month: "short"});

        // console.log("calc",JSON.stringify(this.allcharts));
        let labelList = [];
        let dataList = [];
        this.allchartsSub.subscribe(x => {
            console.log("zzzzzzzzzzzzz-----------------------------------------------zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", x);
            x.forEach(y => {
                console.log("courbe", y);
                Object.values(y[0]).filter((a, b) => b == 3).forEach(z => labelList.push(formatter.format(z as Date)))
                Object.values(y).forEach(z => labelList.push(formatter.format(z as Date)))


            })
            console.log("labellist", labelList);
            this.lineData = {
                labels: labelList,
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [


                            80, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: '#03A9F4'
                    },
                    {
                        label: 'Second Dataset',
                        data: [48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderColor: '#FFC107'
                    }
                ]
            };
        })

        this.barData = {
            labels: ['February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#03A9F4',
                    borderColor: '#03A9F4',
                    data: [59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107',
                    data: [48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        '#FFC107',
                        '#03A9F4',
                        '#4CAF50'
                    ],
                    hoverBackgroundColor: [
                        '#FFE082',
                        '#81D4FA',
                        '#A5D6A7'
                    ]
                }]
        };

        this.polarData = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    3,
                    14
                ],
                backgroundColor: [
                    '#FFC107',
                    '#03A9F4',
                    '#4CAF50',
                    '#E91E63',
                    '#9C27B0'
                ],
                label: 'My dataset'
            }],
            labels: [
                'Red',
                'Green',
                'Yellow',
                'Grey',
                'Blue'
            ]
        };

        this.radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };
    }


    loadAllPrestations() {

        this.prestationService.list()
            .pipe(first())
            .subscribe(
                prestations => {

                    console.log("data returned = ", prestations);

                    this.calculeTauxStt(new Date, prestations);

                    this.prestations = prestations;

                    //this.prestations.filter( x => x.dateDebutPrestation<monthDiff && x.dateFinPrestation>monthDiff).map()

                    prestations.filter((a, b) => a)
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });
    }


    private calculeTauxStt(date: any, prestations: any) {
        debugger
        let currentMonth = date.getUTCMonth();
        for (let i = 0; i < 6; i++) {
            this.monthList.push(new Date(date.getFullYear(), currentMonth - i, 1));
        }
        const nbreStt = 0;
        console.log("on parcours ", this.monthList);

        this.monthList.forEach(month => {
            console.log("=========================================================================== ");
            console.log("================================== le moi ========================== ", month.getUTCMonth());
            console.log("=========================================================================== ");
            let chartsLines = [];

            const nbreTotal = prestations.forEach((prestation, i) => {

                var temp;
                console.log(chartsLines);
                debugger;

                /*                chartsLines.forEach(line => {
                                    if (line.departement == prestation.departement &&
                                        new Date(prestation.dateDebutPrestation) < month &&
                                        new Date(prestation.dateFinPrestation) > month) {

                                        console.log("*****<<", i, ">>********************************* ON A MET A JOUR CE DEPARTEMENT **********************************************", prestation.departement);

                                        debugger
                                        if (prestation.collaborateur['stt'] == 'Oui') line.tauxStt++;
                                        line.nombreColl++;
                                        temp = chartsLines;
                                    }
                                    else if (line => line.departement != prestation.departement) {
                                        temp = chartsLines;

                                        console.log("*****<<", i, ">>********************************* ON A TROUVE UN NOUVEAU DEPARTEMENT **********************************************", prestation.departement);

                                        debugger
                                        temp.push(new ChartLine(prestation.departement, 1, 1, month));
                                        if (prestation.collaborateur['stt'] == 'Oui') line.tauxStt++;
                                        line.nombreColl++;
                                    }


                                });*/

                chartsLines
                    .filter(line =>
                        line.departement == prestation.departement &&
                        new Date(prestation.dateDebutPrestation) < month &&
                        new Date(prestation.dateFinPrestation) > month)
                    .map(d => {
                        console.log("*****<<", i, ">>********************************* ON A MET A JOUR CE DEPARTEMENT **********************************************", prestation.departement);

                        debugger
                        if (prestation.collaborateur['stt'] == 'Oui') d.tauxStt++;
                        d.nombreColl++;
                        temp = chartsLines;

                    });
                if (chartsLines.every(line => line.departement != prestation.departement)) {

                    console.log("*****<<", i, ">>********************************* ON A TROUVE UN NOUVEAU DEPARTEMENT **********************************************", prestation.departement);
                    temp = chartsLines;

                    debugger
                    let tauxStt = (prestation.collaborateur['stt'] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }


                if (chartsLines.length == 0) {
                    console.log("******<<", i, ">>******************************** ON A PAS ENCORE TROUVE DE DEPARTEMENT : INIT PREMIER **********************************************", prestation.departement);

                    debugger;
                    temp = chartsLines;
                    let tauxStt = (prestation.collaborateur['stt'] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }
                if (temp) chartsLines = temp;
            });
            this.allcharts.push(chartsLines);
        });

        console.log("Toutes les courbes de soutraitance", this.allcharts);

        /*   //chartLine.push({"mois": firstDayOfMonth.getMonth(), "taux de Stt": nbreStt / nbreTotal * 100});
           //console.log("Etude pour le mois :", firstDayOfMonth.getMonth());
           console.log("Le nombre de sous traitant =", nbreStt);
           console.log("Le nombre de total de collaborateurs =", nbreTotal);
           console.log("Le taux de soustraitance est =", nbreStt / nbreTotal * 100);*/
        return this.allchartsSub.next(this.allcharts);
    }
}
