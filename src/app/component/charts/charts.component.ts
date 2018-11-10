import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {PrestationService} from "../../service/datas.service";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {Prestation} from "../../model/referenciel";
import {BehaviorSubject} from "rxjs";

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


    at_date$ = new Date();

    public chart_date$ = new BehaviorSubject<Date>(this.at_date$);

    lineData: any;

    barData: any;

    allchartsSub = new BehaviorSubject<ChartLine[]>(null);

    allcharts = [];


    monthList = [];

    lineColor = ['#FF0000', '#01DF01', '#0040FF', '#FFFF00', '#00FFFF', '#6E6E6E'];

    pieData: any;

    polarData: any;

    radarData: any;
    private prestations: Prestation[];

    constructor(private prestationService: PrestationService,
                private router: Router,
                private alertService: AlertService) {

    }


    ngOnInit() {


        this.chart_date$.next(this.at_date$);

        this.loadAllPrestations()
        this.extracted();


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


    }

    private extracted() {
        var formatter = new Intl.DateTimeFormat("fr", {month: "short"});

        // console.log("calc",JSON.stringify(this.allcharts));

        this.allchartsSub.subscribe(chartLine => {
            this.lineData = [];

            let labelList = [];
            let dataList = [];
            console.log("zzzzzzzzzzzzz-----------------------------------------------zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", chartLine);

            if (chartLine != null || chartLine != undefined && JSON.stringify(chartLine) != "[[],[],[],[],[],[]]") {
                 labelList = [];
                 dataList = [];
                chartLine.forEach((y, i) => {
                    console.log("courbe", y);
                    console.log("courbe departement=", y[0].departement);
                    if (i == 0) Object.values(y).forEach(z => labelList.push(formatter.format(z.dateRef as Date)));
                    let stt = [];
                    Object.values(y).forEach((curr) => stt.push(curr['tauxStt'] / curr['nombreColl'] * 100));
                    console.log("stt", stt);
                    dataList.push({
                        label: y[0].departement,
                        data: stt,
                        fill: false,
                        borderColor: this.lineColor[i]
                    })


                })
            }
            console.log("labellist =", labelList);
            console.log("datalist =", dataList);


            this.lineData = {
                labels: labelList,
                datasets: dataList
            };
        });
    }

    update() {
        debugger
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

        this.chart_date$.next(this.at_date$);

        //this.loadAllPrestations();
        this.extracted();


    }


    loadAllPrestations() {
        this.prestations = [];
        this.chart_date$.subscribe(x => {
            debugger

            this.prestationService.list()
                .pipe(first())
                .subscribe(
                    prestations => {

                        console.log("data returned = ", prestations);

                        this.calculeTauxStt(x, prestations);
                        console.log('la date demandé', x)


                        this.prestations = [];
                        this.prestations = prestations;


                        prestations.filter((a, b) => a)
                    },
                    error => {
                        console.log("data returned = ", error);

                        this.alertService.error(error);
                    });
        });
    }


    private calculeTauxStt(date: any, prestations: any) {
        this.allchartsSub.next([]);
        let currentMonth = date.getUTCMonth();
        this.monthList = [];
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

                let temp;
                console.log(chartsLines);


                chartsLines
                    .filter(line =>
                        line.departement == prestation.departement &&
                        new Date(prestation.dateDebutPrestation) < month &&
                        new Date(prestation.dateFinPrestation) > month)
                    .map(d => {
                        console.log("*****<<", i, ">>********************************* ON A MET A JOUR CE DEPARTEMENT **********************************************", prestation.departement);

                        if (prestation.collaborateur['stt'] == 'Oui') d.tauxStt++;
                        d.nombreColl++;
                        temp = chartsLines;

                    });
                if (chartsLines.every(line => line.departement != prestation.departement)) {

                    console.log("*****<<", i, ">>********************************* ON A TROUVE UN NOUVEAU DEPARTEMENT **********************************************", prestation.departement);
                    temp = chartsLines;

                    let tauxStt = (prestation.collaborateur['stt'] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }


                if (chartsLines.length == 0) {
                    console.log("******<<", i, ">>******************************** ON A PAS ENCORE TROUVE DE DEPARTEMENT : INIT PREMIER **********************************************", prestation.departement);

                    temp = chartsLines;
                    let tauxStt = (prestation.collaborateur['stt'] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }
                if (temp) chartsLines = temp;
            });
            this.allcharts.push(chartsLines);
        });

        let charts = [];
        let chartList = [];
        let allch = [];
        let i = 0;
        this.allcharts.forEach(x => {


            Object.values(x).forEach(y => {
                charts.push(y)
            })

        });

        console.log("vvvvvvvvvvvvvvvvvvvvvvvvv charts = ", charts);

        charts.forEach((line) => {
            if (allch.length == 0) {
                chartList.push(line);
                allch.push(chartList);
            }
            else if (allch.every((x, a, b) => Object.values(x).every(y => y['departement'] != line.departement))) {
                console.log("vvvvvvvvvvvvvvvvvvvvvvvvv Line = ", line.departement);
                console.log("line = ", line);

                var temp = [];
                temp.push(line);
                allch.push(temp);
            }

            else if (allch
                    .filter((x, a, b) => Object.values(x).every((y, e, f) => y['departement'] === line.departement))
                    .forEach((a, b, c) => {
                        a.push(line)
                        console.log("line a = ", a);
                        console.log("line b = ", b);
                        console.log("line b = ", c);
                    })) {
                console.log("line xxxxxxxxxxxxxxxxxx = ", line);

            }


        });


        console.log("XXXXXXXXXXXXXXX Toutes les courbes de soutraitance XXXXXXXXXXXXXXXXXXX ", allch);
        console.log("Toutes les courbes de soutraitance", this.allcharts);

        return this.allchartsSub.next(allch);
    }
}
