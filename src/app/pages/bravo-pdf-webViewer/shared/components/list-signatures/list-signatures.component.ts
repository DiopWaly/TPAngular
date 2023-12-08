import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { IPDFViewerApplication, PDFNotificationService } from 'ngx-extended-pdf-viewer';
import { Subject, combineLatest, concat, of, shareReplay, switchMap, takeUntil } from 'rxjs';
import { EAnnotationEditorParamsType } from '../../data-type';
import { BravoNameEventBusCustom, SavedEditorStampEvent } from '../../events';

const _fakeSource = 'https://api.slingacademy.com/v1/sample-data/photos?limit=3';
@Component({
  selector: 'bravo-list-signatures',
  templateUrl: './list-signatures.component.html',
  styleUrls: ['./list-signatures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BravoListSignatures implements OnInit, OnDestroy {

  public pdfViewerApp!: IPDFViewerApplication;

  private _unSubSubject = new Subject<void>();

  public unSubAction$ = this._unSubSubject.asObservable();

  private _signatureAddSubject = new Subject<string>();

  public signatureAddAction$ = this._signatureAddSubject.asObservable().pipe(takeUntil(this.unSubAction$));

  public signaturesAvailable$ = this._http.get(_fakeSource).pipe(
    takeUntil(this.unSubAction$),
    shareReplay(1),
    switchMap(
      (data: any) => {
        const images = data['photos'].map((item: any) => item['url'])
        return concat(of(images), combineLatest([of(images), this.signatureAddAction$]).pipe(switchMap(([imgs, img]) => of([...imgs, img]))));
      }
    )
  );

  constructor(private _elRef: ElementRef<Element>, private _notificationService: PDFNotificationService, private _cd: ChangeDetectorRef, private _http: HttpClient) {
    this._notificationService.onPDFJSInit.pipe(takeUntil(this.unSubAction$)).subscribe(this._onPdfJsInit.bind(this));
  }

  //*life cycle here:
  ngOnInit() {

  }

  ngOnDestroy(): void {
    this._unSubSubject.next();
    this._unSubSubject.closed || this._unSubSubject.complete();

    this.pdfViewerApp && this.pdfViewerApp.eventBus.off(BravoNameEventBusCustom.savedStampEditor, this.onSavedStampEditor);
  }

  private _onPdfJsInit() {
    this.pdfViewerApp = (window as any).PDFViewerApplication;
    this.pdfViewerApp.eventBus.on(BravoNameEventBusCustom.savedStampEditor, this.onSavedStampEditor);
  }

  public addSignatureToList(pImagSrc: string): void {
    this._signatureAddSubject.next(pImagSrc);
  }

  public onSavedStampEditor = this._handleSavedStampEditor.bind(this);
  private _handleSavedStampEditor({ value }: SavedEditorStampEvent) {
    //?case base 64
    if (typeof value === 'string')
      this.addSignatureToList(value)
    else if (value instanceof ImageBitmap) { //?bitmap
      const _zBase64Str = this._getSrcImageFromImageBitmap(value);
      this.addSignatureToList(_zBase64Str);
    }
  }

  public onClickAddSignatureBtn(pImgEl: HTMLImageElement) {
    
    if (this.pdfViewerApp) {
      createImageBitmap(pImgEl).then(bitmap => {
        this.pdfViewerApp.eventBus.dispatch('switchannotationeditorparams', {
          type: EAnnotationEditorParamsType.CREATE,
          value: bitmap
        });
      });
    }
  }

  private _getSrcImageFromImageBitmap(pValue: ImageBitmap) {
    const canvas = document.createElement("canvas");
    canvas.width = pValue.width;
    canvas.height = pValue.height;
    canvas.style.visibility = "hidden";
    const context = canvas.getContext("2d");
    context && context.drawImage(pValue, 0, 0);
    const zSrcImg = canvas.toDataURL();
    canvas.remove();
    return zSrcImg;
  }
}
