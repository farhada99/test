export type ExComplexElementType = "Bracket";
export type ExSimpleElementType = "Symbol" | "Empty";

export type ExElementType = ExComplexElementType | ExSimpleElementType;

export interface ExElementStateExtra {
    caretIndex: number;//-1 means no caret inside this element, 0 means caret is before first item, etc
    containsCaret: boolean;// does the caret act as a part of this element or belongs to sub-element of other element
    selectionStartIndex: number;//-1 means no selection
    selectionEndIndex: number;//-1 means no selection
    width: number;
    height: number;
    onSize?: (width: number, height: number) => void;
}

export interface ExElementProto {
    type: ExElementType;
    isComplex: boolean;
}

export interface ExSimpleElementProto extends ExElementProto {
    isComplex: false;
}


export interface ExComplexElementProto<ElementType> extends ExElementProto {
    isComplex: true;
    items: ElementType[];
}


export interface ExEmpty extends ExSimpleElementProto {
    type: "Empty",
}

export interface ExSymbol extends ExSimpleElementProto {
    type: "Symbol",
    symbol: string;
}

export interface ExBracket<ElementType> extends ExComplexElementProto<ElementType> {
    type: "Bracket",
}

export type ExElement = ExSymbol | ExEmpty | ExBracket<ExElement>;

// type AddExtra<T, Extra> = T extends ExComplexElementProto<any> ? T & Extra : T extends any ? T & Extra : never;
// export type ExElementState = AddExtra<ExElement, ExElementStateExtra>;

export type ExElementState =
// simple
    (ExEmpty & ExElementStateExtra)
    |
    (ExSymbol & ExElementStateExtra)
    // complex
    |
    (ExBracket<ExElement & ExElementStateExtra> & ExElementStateExtra);