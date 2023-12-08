import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EditorAnnotation, FreeTextEditorAnnotation, InkEditorAnnotation, NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ModalDialogComponent } from 'src/app/modal-dialog/modal-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfVComponent implements OnInit, AfterViewInit {
  selectedFile: any = ""
  selectedFilePath: string = ""
  selectedFileB64: string = ""
  isFileImage: boolean = false;
  isFileDocument: boolean = false;

  constructor(private pdfService: NgxExtendedPdfViewerService,public matDialog: MatDialog){
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.enableScripting = false;
  }
  ngAfterViewInit(): void {
    document.onclick = (args: any) : void => {
      if(args.target.tagName === 'BODY') {
          this.modalDialog?.close()
      }
    }
  }

  ngOnInit(): void {
    this.dragElement(document.getElementById("mydiv"));
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0] ?? null
    if (this.selectedFile) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event) =>{
        let path = event.target == null ? '' : event.target.result
        console.log('path :',path);
        
        this.selectedFilePath = path as string;
        this.selectedFileB64 = this.selectedFilePath.split(',')[1]
        if (this.selectedFilePath.includes('image')) {
          this.isFileImage = true
          this.isFileDocument = false
          
        } else {
          this.isFileImage = false
          this.isFileDocument = true
        }
      } 
      
    }
    console.log('canvas :',document.getElementsByTagName('canvas'));
    
  }
  modalDialog: MatDialogRef<ModalDialogComponent, any> | undefined;
  dialogConfig = new MatDialogConfig();
  dragdiv(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  click(event: any){
    // console.log('event :',event);
    let div = '<div id="div" class="con" style="width: 100px; height: 100px; background: #2a2a2a; position: relative; z-index: 1000;position: absolute;"></div>'
    document.getElementsByClassName('page')[0].insertAdjacentHTML('beforeend', div);
    this.dragdiv(document.getElementById("div"))
    this.combine()
    
    
    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');

// draw a blue cloud
  context.beginPath();
  context.moveTo(170, 80);
  context.bezierCurveTo(130, 100, 130, 150, 230, 150);
  context.bezierCurveTo(250, 180, 320, 180, 340, 150);
  context.bezierCurveTo(420, 150, 420, 120, 390, 100);
  context.bezierCurveTo(430, 40, 370, 30, 340, 50);
  context.bezierCurveTo(320, 5, 250, 20, 250, 50);
  context.bezierCurveTo(200, 5, 150, 20, 170, 80);
  context.closePath();
  context.lineWidth = 5;
  context.fillStyle = '#8ED6FF';
  context.fill();
  context.strokeStyle = '#0000ff';
  context.stroke();

  var imgData = canvas.toDataURL("image/jpeg", 1.0);
  console.log('imgData ',imgData);
  
  var pdf = new jsPDF();

    pdf.addImage(imgData, 'JPEG', 0, 0,20,20);
    pdf.save("download.pdf").autoPrint();
  }
  dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 721, pos4 = 512;
    // var canvasOffset = $("#drawable-canvas").offset();
    // var offsetX = canvasOffset!!.left;
    // var offsetY = canvasOffset!!.top;
    const canvas = <HTMLCanvasElement> document.getElementById(elmnt.id),
      ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    let base_image = new Image();
    base_image.src = "https://i.imgur.com/fFZeedg.png";
    base_image.onload = function(){
      ctx.drawImage(base_image, 10, -90);
    }

    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  /**
   * pour fusionne les deux canvas
   * @param mainElmnt 
   * @param elemnt 
   */
  output(elemnt:any) {
    const bg = <HTMLCanvasElement> document.getElementsByTagName('canvas')[0],
    bgctx = bg?.getContext('2d') as CanvasRenderingContext2D;
    var canvas = <HTMLCanvasElement>document.getElementById(elemnt.id);
    // console.log('this.mouseX :',this.mouseX,'this.mouseY :',this.mouseY);
    bgctx!!.drawImage(canvas, 721, 515);
      // doc.save('FirstPdf.pdf');
  }
  combine(){
    this.output(document.getElementById("mydiv"))
  }
  public addTextEditor(): void {
    const textEditorAnnotation: FreeTextEditorAnnotation = {
      annotationType: 3,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      fontSize: Math.random() * 10 + 20,
      value: '<h1>Hello world</h1>',
      pageIndex: 0,
      rect: [
        50, // height?
        Math.random() * 500 + 350, // y
        Math.random() * 400, // x
        100, // width?
      ],
      rotation: 0,
    };
    this.pdfService.addEditorAnnotation(textEditorAnnotation);
  }
  public addDrawing(): void {
    const x = 400*Math.random();
    const y = 350+500*Math.random();
    const drawing: EditorAnnotation = {
      annotationType: 15,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      thickness: Math.random()*10,
      opacity: 1,
      paths: [
        {
          bezier: [x+0.5, y, x+0.5, y+44, x+44, y+66, x+88, y+44],
          points: [x+0.5, y, x+0.5, y+44],
        },
      ],
      // 'https://i.imgur.com/fFZeedg.png',
      pageIndex: 0,
      rect: [x, y, x+100, y+66],
      rotation: 0,
    };
    this.pdfService.addEditorAnnotation(drawing);
  }

}
