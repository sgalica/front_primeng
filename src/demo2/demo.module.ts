import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ColorPickerModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule
} from 'primeng/primeng';
import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {DashboardDemoComponent} from '../app/demo/view/dashboarddemo.component';
import {SampleDemoComponent} from '../app/demo/view/sampledemo.component';
import {FormsDemoComponent} from '../app/demo/view/formsdemo.component';
import {DataDemoComponent} from '../app/demo/view/datademo.component';
import {PanelsDemoComponent} from '../app/demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from '../app/demo/view/overlaysdemo.component';
import {MenusDemoComponent} from '../app/demo/view/menusdemo.component';
import {MessagesDemoComponent} from '../app/demo/view/messagesdemo.component';
import {MiscDemoComponent} from '../app/demo/view/miscdemo.component';
import {ChartsDemoComponent} from '../app/demo/view/chartsdemo.component';
import {EmptyDemoComponent} from '../app/demo/view/emptydemo.component';
import {FileDemoComponent} from '../app/demo/view/filedemo.component';
import {UtilsDemoComponent} from '../app/demo/view/utilsdemo.component';
import {DocumentationComponent} from '../app/demo/view/documentation.component';
import {CarService} from '../app/demo/service/carservice';
import {CountryService} from '../app/demo/service/countryservice';
import {EventService} from '../app/demo/service/eventservice';
import {NodeService} from '../app/demo/service/nodeservice';

@NgModule({
    imports: [
        SharedModule,

        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ColorPickerModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DataViewModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule
    ],
    declarations: [
        DashboardDemoComponent,
        SampleDemoComponent,
        FormsDemoComponent,
        DataDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        UtilsDemoComponent,
        DocumentationComponent
    ],
    providers: [
        CarService,
        CountryService,
        EventService,
        NodeService
    ]
})
export class DemoModule {
}
