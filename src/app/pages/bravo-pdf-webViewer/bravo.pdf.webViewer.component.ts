import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IPDFViewerApplication, NgxExtendedPdfViewerComponent, PDFNotificationService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Subject, takeUntil } from 'rxjs';
import { PdfToolbarCustom } from './pdf-toolbar/toolbar/bravo.toolbar.custom';

import { BravoPdfSignatureTool } from './pdf-toolbar/tools';
import { BravoNameEventBusCustom } from './shared/events';
pdfDefaultOptions.assetsFolder = 'bleeding-edge';
@Component({
  selector: 'bravo-pdf-webViewer',
  templateUrl: './bravo.pdf.webViewer.component.html',
  styleUrls: ['./bravo.pdf.webViewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BravoPdfWebViewer implements OnInit, AfterViewInit, OnDestroy {
  //*Props here:
  @ViewChild('extendedPdfViewer') extendedPdfViewer!: NgxExtendedPdfViewerComponent;
  @ViewChild('customToolbarTemp', { read: TemplateRef }) customToolbarRef!: TemplateRef<Element>;

  private _unSubObservablesSubject: Subject<void> = new Subject();
  private _unSubObservables$ = this._unSubObservablesSubject.asObservable();

  public toolbar!: PdfToolbarCustom;
  public signatureTool!: BravoPdfSignatureTool;

  public pdfViewerApp!: IPDFViewerApplication;
  //*Constructor here:
  constructor(private _notificationService: PDFNotificationService, private _cd: ChangeDetectorRef,) {
    this._notificationService.onPDFJSInit.pipe(takeUntil(this._unSubObservables$)).subscribe(this.onPdfJsInit.bind(this));
  }
  //*life cycle here:
  public ngOnInit() {

  }

  public ngAfterViewInit(): void {
    this.extendedPdfViewer.customToolbar = this.customToolbarRef;
    this.extendedPdfViewer.textLayer = true;
    this.extendedPdfViewer.showHandToolButton = true;
    this._cd.markForCheck();
  }

  public ngOnDestroy(): void {
    this._unSubObservablesSubject.next();
    if (!this._unSubObservablesSubject.closed) this._unSubObservablesSubject.unsubscribe();

    window.removeEventListener('mousedown', this._onHandleWindowMouseDown);

    if (this.pdfViewerApp) {
      //remove event bus
    }
  }

  //*event here:

  //*method here:
  public onPdfJsInit() {
    //*do something when pdfjs init
    this.pdfViewerApp = (window as any).PDFViewerApplication;
    window.addEventListener('mousedown', this._onHandleWindowMouseDown);
  }

  public toolbarCustomInitialized(sender: PdfToolbarCustom): void {
    this.toolbar = sender;
    this.toolbar.showSelectToolButton = false;
  }

  private _onHandleWindowMouseDown = this._handleWindowMouseDown.bind(this);
  private _handleWindowMouseDown(event: MouseEvent): void {
    this.pdfViewerApp && this.pdfViewerApp.eventBus.dispatch(BravoNameEventBusCustom.widowMouseDown, {
      source: this,
      event: event
    })
  }
}
