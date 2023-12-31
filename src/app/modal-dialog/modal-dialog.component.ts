import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {
  @ViewChild(NgxExtendedPdfViewerComponent, {static: false})
  private pdfViewer!: NgxExtendedPdfViewerComponent;

  constructor(public dialogRef: MatDialogRef<ModalDialogComponent>) {
    dialogRef.beforeClosed().subscribe((result) => {
      console.log('The dialog is about to be closed');
      // Here's the interesting bit:
      this.pdfViewer.ngOnDestroy();
    });
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }
}
