import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFSource } from 'ng2-pdf-viewer';
import { BehaviorSubject } from 'rxjs';
declare var require: any;
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { IConfig } from '@onlyoffice/document-editor-angular';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var docx2html: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontServer';
  viewerUrl = "https://docs.google.com/gview?url=%URL%&embedded=true"
  url = "../../../assets/axa.pdf"
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  files: File[] = [];
  // pdfSrc: string | Uint8Array | PDFSource;
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

  @ViewChild('pdfTable') pdfTable!: ElementRef;
  
  public exportPDF() {
    // const pdfTable = this.pdfTable.nativeElement;
    let html = htmlToPdfmake(this.htmlContent);
    const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).download(); 
    
    // pdfMake.createPdf(documentDefinition)
    pdfMake.createPdf(documentDefinition).getBase64((data) => {
      this.base64 = data;
      console.log('this.base64',this.base64);
      setTimeout(() => {
        this.changeDetectorRef.detectChanges()
      }, 150);
    });
    
  }
  uploadedFile: File;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient
    ){}
  ngOnInit(): void {
  }
  onFileSelected(event: any) {
    // ;
    console.log('waly :',this.handleUpload(event))
    let $img: any = document.querySelector('#file');
    
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log('result :',this.pdfSrc)
      };  
      reader.readAsArrayBuffer($img.files[0]);
    }
  }
  base64 = '';
  upload() {
    let formData = new FormData();
    formData.append("uploads", this.uploadedFile, this.uploadedFile.name);

    this.http.post('http://localhost:5000/post/upload/pdf', formData)
        .subscribe((response) => {
            console.log('response received is ', response);
    })
}
 
  handleUpload(event){
    this.uploadedFile = event.target.files[0];
    this.upload();
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    setTimeout(() => {
      this.changeDetectorRef.detectChanges()
    }, 150);
    reader.onload = (e: any) => {
      this.base64 = reader.result.toString();
    };    
  }
    /**
 * Render PDF preview on selecting file
 */
    // async onPdfUploaded(event: any) {
      
    //   this.files.splice(this.files.indexOf(event), 1);
    //   this.files.push(...event.addedFiles);
    //   console.log('this.files', this.files[0]);
      
    //   let blob =this.files[0].slice(0, this.files[0].size, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); 
    //   let newFile = new File([blob], 'name.pdf', {type: 'application/pdf'});
    //   console.log('file :',newFile);
      
    //   this.files.pop();
    //   this.files.push(newFile);
    //   console.log('event',this.files[0].name);
    //   this.convertTopdf(this.files[0])
  
    //   if (typeof FileReader !== 'undefined') {
    //     const reader = new FileReader();
    //     setTimeout(() => {
    //       this.changeDetectorRef.detectChanges()
    //     }, 150);
    //     reader.onload = (e: any) => {
    //       this.pdfSrc = e.target.result;
    //     };
    //     // reader.readAsArrayBuffer(this.files[0]);
    //     // reader.readAsArrayBuffer(this.convertbase64Topdf(
    //     //   await this.toBase64(this.files[0]).then(m => m)
    //     // ));
    //     reader.readAsArrayBuffer(this.convertbase64Topdf(await this.toBase64(this.files[0])));
    //     // reader.readAsArrayBuffer(new Blob([this.files[0]], { type: 'application/pdf'}));
    //   }
    // }
    /**
     * 
     * @param event 
     */
    async convertTopdf(file: File) {
      console.log('mmmmm', this.convertbase64Topdf(await this.toBase64(file)) );
      // console.log(await this.toBase64(file));
    }
    /**
     * convert file to base64
     * @param file 
     * @returns 
     */
    toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.toString());
      reader.onerror = reject;
    });
    /**
     * decode base base to pdf
     * @param base64
     * @returns 
     */
    convertbase64Topdf = (base64: string) => {
      base64 = base64.split(',')[1];
      const byteArray = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
      return new Blob([byteArray], {type: 'application/pdf'});
    } 
    configOnly: IConfig = {
      // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N1bWVudCI6eyJkaXJlY3RVcmwiOiIiLCJmaWxlVHlwZSI6ImRvY3giLCJpbmZvIjp7Im93bmVyIjoiTWUiLCJ1cGxvYWRlZCI6Ik1vbiBOb3YgMjcgMjAyMyIsImZhdm9yaXRlIjpudWxsfSwia2V5IjoiMTI3LjAuMC4xbmV3X18xXy5kb2N4MTcwMTA4NzExMjkwNiIsInBlcm1pc3Npb25zIjp7ImNoYXQiOnRydWUsImNvbW1lbnQiOnRydWUsImNvcHkiOnRydWUsImRvd25sb2FkIjp0cnVlLCJlZGl0Ijp0cnVlLCJmaWxsRm9ybXMiOnRydWUsIm1vZGlmeUNvbnRlbnRDb250cm9sIjp0cnVlLCJtb2RpZnlGaWx0ZXIiOnRydWUsInByaW50Ijp0cnVlLCJyZXZpZXciOnRydWUsInJldmlld0dyb3VwcyI6bnVsbCwiY29tbWVudEdyb3VwcyI6e30sInVzZXJJbmZvR3JvdXBzIjpudWxsLCJwcm90ZWN0Ijp0cnVlfSwicmVmZXJlbmNlRGF0YSI6eyJmaWxlS2V5Ijoie1wiZmlsZU5hbWVcIjpcIm5ldyAoMSkuZG9jeFwiLFwidXNlckFkZHJlc3NcIjpcIjEyNy4wLjAuMVwifSIsImluc3RhbmNlSWQiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUifSwidGl0bGUiOiJuZXcgKDEpLmRvY3giLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvZG93bmxvYWQ_ZmlsZU5hbWU9bmV3JTIwKDEpLmRvY3gmdXNlcmFkZHJlc3M9MTI3LjAuMC4xIn0sImRvY3VtZW50VHlwZSI6IndvcmQiLCJlZGl0b3JDb25maWciOnsiYWN0aW9uTGluayI6bnVsbCwiY2FsbGJhY2tVcmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvdHJhY2s_ZmlsZW5hbWU9bmV3JTIwKDEpLmRvY3gmdXNlcmFkZHJlc3M9MTI3LjAuMC4xIiwiY29FZGl0aW5nIjpudWxsLCJjcmVhdGVVcmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvZWRpdG9yP2ZpbGVFeHQ9ZG9jeCZ1c2VyaWQ9dWlkLTEmdHlwZT1kZXNrdG9wJmxhbmc9ZW4iLCJjdXN0b21pemF0aW9uIjp7ImFib3V0Ijp0cnVlLCJjb21tZW50cyI6dHJ1ZSwiZmVlZGJhY2siOnRydWUsImZvcmNlc2F2ZSI6ZmFsc2UsImdvYmFjayI6eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvIn0sInN1Ym1pdEZvcm0iOmZhbHNlfSwiZW1iZWRkZWQiOnsiZW1iZWRVcmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvZG93bmxvYWQ_ZmlsZU5hbWU9bmV3JTIwKDEpLmRvY3giLCJzYXZlVXJsIjoiaHR0cDovL2xvY2FsaG9zdC9leGFtcGxlL2Rvd25sb2FkP2ZpbGVOYW1lPW5ldyUyMCgxKS5kb2N4Iiwic2hhcmVVcmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvZG93bmxvYWQ_ZmlsZU5hbWU9bmV3JTIwKDEpLmRvY3giLCJ0b29sYmFyRG9ja2VkIjoidG9wIn0sImZpbGVDaG9pY2VVcmwiOiIiLCJsYW5nIjoiZW4iLCJtb2RlIjoiZWRpdCIsInBsdWdpbnMiOnsicGx1Z2luc0RhdGEiOltdfSwidGVtcGxhdGVzIjpbeyJpbWFnZSI6IiIsInRpdGxlIjoiQmxhbmsiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0L2V4YW1wbGUvZWRpdG9yP2ZpbGVFeHQ9ZG9jeCZ1c2VyaWQ9dWlkLTEmdHlwZT1kZXNrdG9wJmxhbmc9ZW4ifSx7ImltYWdlIjoiaHR0cDovL2xvY2FsaG9zdC9leGFtcGxlL2ltYWdlcy9maWxlX2RvY3guc3ZnIiwidGl0bGUiOiJXaXRoIHNhbXBsZSBjb250ZW50IiwidXJsIjoiaHR0cDovL2xvY2FsaG9zdC9leGFtcGxlL2VkaXRvcj9maWxlRXh0PWRvY3gmdXNlcmlkPXVpZC0xJnR5cGU9ZGVza3RvcCZsYW5nPWVuJnNhbXBsZT10cnVlIn1dLCJ1c2VyIjp7Imdyb3VwIjoiIiwiaWQiOiJ1aWQtMSIsIm5hbWUiOiJKb2huIFNtaXRoIn19LCJoZWlnaHQiOiIxMDAlIiwidG9rZW4iOiIiLCJ0eXBlIjoiZGVza3RvcCIsIndpZHRoIjoiMTAwJSIsImlhdCI6MTcwMTA5OTU0NywiZXhwIjoxNzAxMDk5ODQ3fQ.ypqHhyyKrRjQbK4xCUaR7gJcTXPyo87EzGef7ulrsIM",
      document: {
        "fileType": "docx",
        "key": "",
        "title": "new(1).docx",
        "url": "http://localhost"
      },
      documentType: "word",
      editorConfig: {
        "callbackUrl": "http://localhost/example/track?filename=new%20(1).docx&useraddress=127.0.0.1",
        mode: "edit",
        
        user:{
          "id": "uid-1",
          "name": "John Smith"
        },
        customization:{
          forcesave: true
        }
      },
      width: "100%",
      height: "1100px"
    }
  
    onDocumentReady = (event) => {
      console.log("Document is loaded");
    }; 
}
