import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, startWith, catchError, timeout, tap } from 'rxjs/operators';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ServerService } from 'src/app/services/server.service';
import { AppState } from 'src/app/interfaces/app-state';
import { CustumResponse } from 'src/app/interfaces/custum-response';
import { DataState } from 'src/app/enum/data-state.enum';
import { Status } from 'src/app/enum/status.enum';
import { Server } from 'src/app/interfaces/server';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IConfig } from '@onlyoffice/document-editor-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['image', 'ipAddress', 'name', 'memory', 'status','ping','action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // dataSource: MatTableDataSource<Server>;
  dataSource = new MatTableDataSource<Server>();
  url = "../../../assets/axa.pdf"
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text in this rich text editor....',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //
  appState$: Observable<AppState<CustumResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private dataSubject = new BehaviorSubject<CustumResponse>(null);
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  onFileSelected(event: any) {
    let $img: any = document.querySelector('#file');
    
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        
      };
      setTimeout(()=>{console.log(this.pdfSrc);},5000)

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  constructor(
    private serverService: ServerService,
    private changeDetectorRefs: ChangeDetectorRef,
    private route: Router
    ){}
  ngAfterViewInit(): void {
    console.log("After Content init");
    
  }

  ngOnInit(): void {
    // this.route.navigate(['/rip'])
    console.log("On init");
    // this.appState$ = this.serverService.servers$
    // .pipe(
    //   map(response => {
    //     this.dataSubject.next(response);
    //     // this.dataSource = new MatTableDataSource<Server>(this.dataSubject.value.data.servers)
    //     this.dataSource.data = this.dataSubject.value.data.servers;
    //     this.dataSource.paginator = this.paginator;
    //     // this.paginator.subscribe(rep => this.dataSource.paginator = rep);
    //     return { dataState: DataState.LOADED_STATE, appData: response}
    //   }),
    //   startWith({ dataState: DataState.LOADING_STATE, appData: null }),
    //   catchError((error: string) => {
    //     return of({dataState: DataState.ERROR_STATE, error})
    //   })
    // )
    console.log('bien');
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  ping(element: Server){
    this.appState$ = this.serverService.ping$(element.ipAddress)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data: {
            servers: this.dataSubject.value.data.servers
          }}
        );
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )
  }

  delete(server: Server){
    this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data: {
            servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)
          }}
        );
        console.log('bien :',this.dataSubject.value);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )
    
  }
  deletetest(server: Server){
    this.serverService.delete(server.id)
    .subscribe(response => {
      this.dataSubject.next(
        {...response, data: {
          servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)
        }}
      );
      this.dataSource.data = this.dataSubject.value.data.servers.filter(s => s.id !== server.id)
      console.log('bien :',this.dataSource.data);
    })
  }
  configOnly: IConfig = {
    document: {
      "fileType": "docx",
      "key": "Khirz6zTPdfd7",
      "title": "Example Document Title.docx",
      "url": "http://localhost/example/download?fileName=new.docx&useraddress=172.17.0.1"
    },
    documentType: "word",
    editorConfig: {
      "callbackUrl": "https://example.com/url-to-callback.ashx"
    },
    width: "100%",
    height: "1100px"
  }

  onDocumentReady = (event) => {
    console.log("Document is loaded");
  };

}
