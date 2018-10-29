///<reference path="../../node_modules/rxjs/internal/BehaviorSubject.d.ts"/>
import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ScrollPanel} from 'primeng/primeng';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthService} from './service/auth.service';
import {versionLong} from '../_versions';
import {Data} from "./model/data";


enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {


    //public version: string = environment.VERSION;

    version = versionLong
    date = new Date();


    isLoggedIn$ = new BehaviorSubject<boolean>(false); // {1}

     //isLoggedIn$: Observable<boolean> = false;                  // {1}


    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    darkMenu = false;

    profileMode = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ScrollPanel;

    constructor(public renderer: Renderer2, private authService: AuthService) {     }

    ngOnInit() {
        /*
         The use of "async()" and " await" clears the ExpressionChangedAfterItHasBeenCheckedError exception.
        */
         this.authService.isLoggedIn.subscribe(async(value) => this.isLoggedIn$.next(await value)); // {2}

//this.getModelMatch(0);
    }

    getModelMatch(T) {
        debugger;

        T = {
            contrat: "ATG-000111",
            dateMaj: 36526,
            dateCreation: 36526,
            numeroAtg: "ATG-000666-0",
            trigrammeMaj: "SBA16490",
            trigrammeCreation: "SBA16490"
        };
        console.log(T);

        var constructor;
        var data = new Data;
        var obj;
        Object.values(data).forEach(x => {
            obj = new x.constructor();

            debugger;
            var acc = Object.entries(T).reduce((accumulator, currentValue) => {
                // console.log(x.hasOwnProperty(currentValue));
                console.log("currentValue = ",currentValue[0]);
                console.log("accumulator = ", accumulator);

                if (accumulator && x.hasOwnProperty(currentValue[0])) {

                    Object.defineProperty(obj, currentValue[0], {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: currentValue[1]
                    });
                    // obj.constructor.argumentscurrentValue[0] = T.currentValue[1];

                    console.log("notre nouvel obj = ", obj);

                    return x.hasOwnProperty(currentValue[0]);
                }
                else {
                    return false;
                }


            }, true);
            console.log("accumulateur", acc);


            console.log("name of the property", x);

        });

        return obj;
    }

    ngAfterViewInit() {

        if (!this.isLoggedIn$) {
            setTimeout(() => {
                this.layoutMenuScrollerViewChild.moveBar();
            }, 100);
        }


    }


    onLogout() {
        this.authService.logout();                      // {3}
    }


    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {
                this.layoutMenuScrollerViewChild.moveBar();
            }, 450);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }


}
