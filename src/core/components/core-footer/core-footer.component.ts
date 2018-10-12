import {Component} from '@angular/core';
import {versionLong} from "../../../_versions";

@Component({
    selector: 'core-footer',
    templateUrl: './core-footer.component.html',
    styleUrls: ['./core-footer.component.scss']
})
export class CoreFooterComponent {

    version = versionLong
    date = new Date();


}
