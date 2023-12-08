import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IPDFViewerApplication, NgxExtendedPdfViewerService, PDFNotificationService } from 'ngx-extended-pdf-viewer';
import { BravoDrawingApp, CanvasSource } from '../../../shared/components/drawing-app/drawing-app.component';
import { EAnnotationEditorParamsType } from '../../../shared/data-type';
import { BravoNameEventBusCustom, SavedEditorStampEvent } from '../../../shared/events';
// import { BravoDrawingApp, CanvasSource } from 'src/app/bravo-pdf-webViewer/shared/components/drawing-app/drawing-app.component';
// import { EAnnotationEditorParamsType } from 'src/app/bravo-pdf-webViewer/shared/data-type';
// import { BravoNameEventBusCustom, SavedEditorStampEvent } from 'src/app/bravo-pdf-webViewer/shared/events';

@Component({
  selector: 'bravo-pdf-signature-tool',
  templateUrl: './signature-tool.component.html',
  styleUrls: ['./signature.tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BravoPdfSignatureTool implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawingTool') drawingTool!: BravoDrawingApp;
  @ViewChild('signatureModal') signatureModal!: ElementRef<HTMLElement>;
  @Input()
  public isOpenTool = false;

  public isSelected = false;

  get hostElement() {
    return this._elRef.nativeElement;
  }

  private _isPdfInit = false;

  public pdfViewerApp!: IPDFViewerApplication;


  constructor(private _elRef: ElementRef<Element>, private _cd: ChangeDetectorRef, private _notificationService: PDFNotificationService, private _ngxExService: NgxExtendedPdfViewerService) {
    const subscription = this._notificationService.onPDFJSInit.subscribe(() => {
      this.onPdfJsInit();
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  private onPdfJsInit() {
    this.pdfViewerApp = (window as any).PDFViewerApplication;
    this._isPdfInit = true;
  }

  public savedActionDrawingApp(pPayload: CanvasSource) {
    if (this._isPdfInit) {
      createImageBitmap(pPayload.asBlob).then((bitmap) => {
        this.pdfViewerApp.eventBus.dispatch('switchannotationeditorparams', {
          source: this,
          type: EAnnotationEditorParamsType.CREATE,
          value: bitmap
        });
        //*trigger event for saved signature to list
        const _payload = {
          source: this,
          value: pPayload.asUrl
        } as SavedEditorStampEvent
        this.pdfViewerApp.eventBus.dispatch(BravoNameEventBusCustom.savedStampEditor, _payload)
      });
    }
    this.onCloseSignatureTool();
  }

  public openDrawingTool() {
    this.isOpenTool = true;
    this._cd.detectChanges();
    if (this.drawingTool) {
      this.drawingTool.setDefaultValue();
      this.drawingTool.onHandleClearBtnClick();
    }
  }

  public onCloseSignatureTool() {
    this.isOpenTool = false;
    this._cd.detectChanges();
  }
}
