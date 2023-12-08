import { NgModule } from "@angular/core";
import { NotFoundComponent } from "../not-found/not-found.component";
import { HomeComponent } from "../pages/home/home.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../app-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatModule } from "./mat.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations:[
        HomeComponent,
        NotFoundComponent,
    ],
    imports:[
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatModule,
        
    ],
    exports:[
        AppRoutingModule,
        HttpClientModule,
    ]
})
export class CoreModule{

}