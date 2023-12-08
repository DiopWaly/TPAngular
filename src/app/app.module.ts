import { DocumentEditorModule } from '@onlyoffice/document-editor-angular';
import { BravoPdfWebViewerModule } from './pages/bravo-pdf-webViewer/bravo.pdf.webViewer.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorInterceptor } from './interceptor.interceptor';
import { CoreModule } from './core/core.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { PdfVComponent } from './pages/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    PdfVComponent,
    ModalDialogComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    NgxDocViewerModule,
    PdfViewerModule,
    NgxDropzoneModule,
    AngularEditorModule,
    FormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    MatDialogModule,
    BravoPdfWebViewerModule,
    DocumentEditorModule,
    DocumentEditorModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
