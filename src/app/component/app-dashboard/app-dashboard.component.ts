import {Component, OnInit} from '@angular/core';
import {NodeService} from '../../service/node.service';
import {SelectItem, TreeNode} from 'primeng/primeng';
import {Car} from '../../model/car';
import {EventService} from '../../service/eventservice';

@Component({
    selector: 'app-dashboard',
    templateUrl: './app-dashboard.component.html',
    styleUrls: ['./app-dashboard.component.scss']
})
export class AppDashboardComponent implements OnInit {

    ngOnInit(): void {
    }



}
