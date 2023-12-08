import { BravoPdfSignatureTool } from './../signature-tool/signature-tool.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResponsiveVisibility } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'bravo-pdf-editor',
  templateUrl: './bravo.pdf.editor.component.html',
  styleUrls: ['./bravo.pdf.editor.component.scss']
})

export class BravoPdfEditorTools implements OnInit {
  @ViewChild('bravoPdfSignatureTool') signatureTool!: BravoPdfSignatureTool;

  @Input()
  public showDrawEditor: ResponsiveVisibility = true;

  @Input()
  public showTextEditor: ResponsiveVisibility = true;

  @Input()
  public showStampEditor: ResponsiveVisibility = true;

  constructor() { }




  ngOnInit() { }

}
