export enum EAnnotationEditorType {
  DISABLE = -1,
  NONE = 0,
  FREETEXT = 3,
  STAMP = 13,
  INK = 15,
};

export enum EAnnotationEditorParamsType {
  RESIZE = 1,
  CREATE = 2,
  FREETEXT_SIZE = 11,
  FREETEXT_COLOR = 12,
  FREETEXT_OPACITY = 13,
  INK_COLOR = 21,
  INK_THICKNESS = 22,
  INK_OPACITY = 23,
};


export enum ERenderingIntentFlag {
  ANY = 0x01,
  DISPLAY = 0x02,
  PRINT = 0x04,
  SAVE = 0x08,
  ANNOTATIONS_FORMS = 0x10,
  ANNOTATIONS_STORAGE = 0x20,
  ANNOTATIONS_DISABLE = 0x40,
  OPLIST = 0x100,
};

export enum AnnotationMode {
  DISABLE = 0,
  ENABLE = 1,
  ENABLE_FORMS = 2,
  ENABLE_STORAGE = 3,
};

export enum AnnotationType {
  TEXT = 1,
  LINK = 2,
  FREETEXT = 3,
  LINE = 4,
  SQUARE = 5,
  CIRCLE = 6,
  POLYGON = 7,
  POLYLINE = 8,
  HIGHLIGHT = 9,
  UNDERLINE = 10,
  SQUIGGLY = 11,
  STRIKEOUT = 12,
  STAMP = 13,
  CARET = 14,
  INK = 15,
  POPUP = 16,
  FILEATTACHMENT = 17,
  SOUND = 18,
  MOVIE = 19,
  WIDGET = 20,
  SCREEN = 21,
  PRINTERMARK = 22,
  TRAPNET = 23,
  WATERMARK = 24,
  THREED = 25,
  REDACT = 26,
};
