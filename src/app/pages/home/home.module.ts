import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HomeComponent } from './home.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DocumentEditorModule } from "@onlyoffice/document-editor-angular";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PdfViewerModule,
    AngularEditorModule,
    DocumentEditorModule
  ]
})
export class HomeModule { }
