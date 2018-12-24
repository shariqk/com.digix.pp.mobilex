

export interface MSVisionOcrResult {
    language:    string;
    textAngle:   number;
    orientation: string;
    regions:     Region[];
}

export interface Region {
    boundingBox: string;
    lines:       Line[];
}

export interface Line {
    boundingBox: string;
    words:       Word[];
}

export interface Word {
    boundingBox: string;
    text:        string;
}


export interface MSVisionApiResult {
    categories:  Category[];
    tags:        Tag[];
    description: Description;
    requestId:   string;
    metadata:    Metadata;
}

export interface Category {
  name: string;
  score: number;
}

export interface Description {
    tags:     string[];
    captions: Caption[];
}

export interface Caption {
    text:       string;
    confidence: number;
}

export interface Metadata {
    height: number;
    width:  number;
    format: string;
}

export interface Tag {
    name:       string;
    confidence: number;
    hint?:      string;
}
