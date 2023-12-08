import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
@Component({
  selector: 'bravo-drawing-app',
  templateUrl: './drawing-app.component.html',
  styleUrls: ['./drawing-app.component.scss']
})

export class BravoDrawingApp implements OnInit, AfterViewInit, OnDestroy {

  public canvas!: HTMLCanvasElement;

  public toolBtns!: NodeListOf<HTMLLIElement>;

  public fillColor!: HTMLInputElement;

  public sizeSlider!: HTMLInputElement;

  public colorBtns!: NodeListOf<HTMLLIElement>;

  public colorPicker!: HTMLInputElement;

  public clearCanvas!: HTMLButtonElement;

  public saveImg!: HTMLButtonElement;

  public ctx!: CanvasRenderingContext2D;

  public prevMouseX!: number;

  public prevMouseY!: number;

  public snapshot!: ImageData;

  public isDrawing!: boolean;

  public selectedTool!: string;

  public brushWidth!: number;

  public selectedColor!: string;

  @Output() public savedAction = new EventEmitter<CanvasSource>();
  get hostElement() {
    return this._elRef.nativeElement;
  }

  constructor(private _elRef: ElementRef<Element>, private _renderer2: Renderer2) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this._setupViewInit();
    this.setDefaultValue();
  }

  ngOnDestroy(): void {
    this._unbindingEvent();
    if (this.savedAction.closed) this.savedAction.unsubscribe();
  }

  private _setupViewInit() {
    this.canvas = this.hostElement.querySelector('.drawing-board canvas') as HTMLCanvasElement;
    this.toolBtns = this.hostElement.querySelectorAll(".tool");
    this.fillColor = this.hostElement.querySelector("#fill-color") as HTMLInputElement;
    this.sizeSlider = this.hostElement.querySelector("#size-slider") as HTMLInputElement;
    this.colorBtns = this.hostElement.querySelectorAll(".colors .option");
    this.colorPicker = this.hostElement.querySelector("#color-picker") as HTMLInputElement;
    this.clearCanvas = this.hostElement.querySelector(".clear-canvas") as HTMLButtonElement;
    this.saveImg = this.hostElement.querySelector(".save-img") as HTMLButtonElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this._bindingEvent();
  }

  public setDefaultValue() {
    this.isDrawing = false;
    this.selectedTool = 'brush';
    this.brushWidth = 5;
    this.selectedColor = "#000";

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this._setCanvasBackground();
  }

  private _bindingEvent() {
    if (this.canvas) {
      this.canvas.addEventListener("mousedown", this.onStartDraw);
      this.canvas.addEventListener("mousemove", this.onDrawing);
      this.canvas.addEventListener("mouseup", this.onEndDraw);
    }

    this.clearCanvas && this.clearCanvas.addEventListener("click", this.onHandleClearBtnClick);

    this.saveImg && this.saveImg.addEventListener("click", this.onSaveClick.bind(this));

    this.toolBtns && this.toolBtns.length > 0 && this.toolBtns.forEach(btn => {
      btn.addEventListener("click", this.onToolBtnClick.bind(this, btn));
    });

    this.sizeSlider && this.sizeSlider.addEventListener("change", () => this.brushWidth = +this.sizeSlider.value); // passing slider value as

    this.colorBtns && this.colorBtns.length > 0 && this.colorBtns.forEach(btn => {
      btn.addEventListener("click", this.onHandleColorBtnClick.bind(this, btn));
    });

    this.colorPicker && this.colorPicker.addEventListener("change", this.onHandleColorPickerChange);
  }

  private _unbindingEvent() {
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.onStartDraw);
      this.canvas.removeEventListener("mousemove", this.onDrawing);
      this.canvas.removeEventListener("mouseup", this.onEndDraw);
    }

    this.clearCanvas && this.clearCanvas.removeEventListener("click", this.onHandleClearBtnClick);

    this.saveImg && this.saveImg.removeEventListener("click", this.onSaveClick.bind(this));

    this.toolBtns && this.toolBtns.length > 0 && this.toolBtns.forEach(btn => {
      btn.removeEventListener("click", this.onToolBtnClick.bind(this, btn));
    });

    this.sizeSlider && this.sizeSlider.removeEventListener("change", () => this.brushWidth = +this.sizeSlider.value); // passing slider value as

    this.colorBtns && this.colorBtns.length > 0 && this.colorBtns.forEach(btn => {
      btn.removeEventListener("click", this.onHandleColorBtnClick.bind(this, btn));
    });

    this.colorPicker && this.colorPicker.removeEventListener("change", this.onHandleColorPickerChange);
  }

  public onHandleColorPickerChange = this._handleColorPickerChange.bind(this);
  private _handleColorPickerChange() {
    if (this.colorPicker.parentElement) {
      // passing picked color value from color picker to last color btn background
      this.colorPicker.parentElement.style.background = this.colorPicker.value;
      this.colorPicker.parentElement.click();
    }
  }

  public onHandleColorBtnClick = this._handleColorBtnClick.bind(this);
  private _handleColorBtnClick(owner: HTMLElement) {
    // adding click event to all color button
    // removing selected class from the previous option and adding on current clicked option
    const _colorBtnActive = document.querySelector(".options .selected");
    _colorBtnActive && _colorBtnActive.classList.remove("selected");
    owner.classList.add("selected");
    // passing selected btn background color as selectedColor value
    this.selectedColor = window.getComputedStyle(owner).getPropertyValue("background-color");

  }

  public onToolBtnClick = this._handleToolBtnClick.bind(this);
  private _handleToolBtnClick(owner: HTMLLIElement) {
    // removing active class from the previous option and adding on current clicked option
    const toolActive = document.querySelector(".options .active");
    toolActive && toolActive.classList.remove("active")
    owner.classList.add("active");
    this.selectedTool = owner.id;
  }


  public onHandleClearBtnClick = this._handleClearBtnClick.bind(this);
  private _handleClearBtnClick() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clearing whole canvas
    this._setCanvasBackground();
    this.isDrawing = false;
  }


  public onStartDraw = this._handleStartDraw.bind(this);
  private _handleStartDraw(e: MouseEvent) {
    if (this.canvas.width === 0 || this.canvas.height === 0) return;
    this.isDrawing = true;
    this.prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    this.prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    this.ctx.beginPath(); // creating new path to draw
    this.ctx.lineWidth = this.brushWidth; // passing brushSize as line width
    this.ctx.strokeStyle = this.selectedColor; // passing selectedColor as stroke style
    this.ctx.fillStyle = this.selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  public onDrawing = this._handleDrawing.bind(this);
  private _handleDrawing(e: MouseEvent) {
    if (!this.isDrawing) return; // if isDrawing is false return from here
    this.ctx.putImageData(this.snapshot, 0, 0); // adding copied canvas data on to this canvas

    if (this.selectedTool === "brush" || this.selectedTool === "eraser") {
      // if selected tool is eraser then set strokeStyle to white
      // to paint white color on to the existing canvas content else set the stroke color to selected color
      this.ctx.strokeStyle = this.selectedTool === "eraser" ? "#fff" : this.selectedColor;
      this.ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
      this.ctx.stroke(); // drawing/filling line with color
    } else if (this.selectedTool === "rectangle") {
      this._drawRect(e);
    } else if (this.selectedTool === "circle") {
      this._drawCircle(e);
    } else {
      this._drawTriangle(e);
    }
  }

  public onEndDraw = this._handleEndDraw.bind(this);
  private _handleEndDraw(e: MouseEvent) {
    this.isDrawing = false;
  }

  public onSaveClick = this._handleSaveClick.bind(this);

  private _handleSaveClick(event: MouseEvent) {
    const _payload: CanvasSource = {
      asUrl: this.canvas.toDataURL('image/jpeg', 1),
    } as CanvasSource;

    this.canvas.toBlob((blob) => {
      blob && (_payload.asBlob = blob)
      this.savedAction.emit(_payload)
    }, 'image/jpeg', 1);
  }

  private _handleDownloadClick() {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpeg`; // passing current date as link download value
    link.href = this.canvas.toDataURL('image/jpeg', 1); // passing canvasData as link href value
    link.click(); // clicking link to download image
    link.remove();
  }

  private _drawRect(e: MouseEvent) {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!this.fillColor.checked) {
      // creating circle according to the mouse pointer
      return this.ctx.strokeRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
    }
    this.ctx.fillRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
  }

  private _drawCircle(e: MouseEvent) {
    this.ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((this.prevMouseX - e.offsetX), 2) + Math.pow((this.prevMouseY - e.offsetY), 2));
    this.ctx.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke(); // if fillColor is checked fill circle else draw border circle
  }

  private _drawTriangle(e: MouseEvent) {
    this.ctx.beginPath(); // creating new path to draw circle
    this.ctx.moveTo(this.prevMouseX, this.prevMouseY); // moving triangle to the mouse pointer
    this.ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    this.ctx.lineTo(this.prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    this.ctx.closePath(); // closing path of a triangle so the third line draw automatically
    this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke(); // if fillColor is checked fill triangle else draw border
  }

  private _setCanvasBackground() {
    // setting whole canvas background to white, so the downloaded img background will be white
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
  }

}

export type CanvasSource = {
  asUrl: string;
  asBlob: Blob
}
