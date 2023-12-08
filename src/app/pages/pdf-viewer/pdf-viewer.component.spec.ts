import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfVComponent } from './pdf-viewer.component';


describe('PdfViewerComponent', () => {
  let component: PdfVComponent;
  let fixture: ComponentFixture<PdfVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfVComponent]
    });
    fixture = TestBed.createComponent(PdfVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
