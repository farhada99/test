import {ExElement, ExElementState} from "./Model";


// const DefaultState:ExElementState = {
//     caretIndex: -1,
//     selectionStartIndex: -1,
//     selectionEndIndex: -1,
//     containsCaret: false,
//     type: "Text",
//     items: []
// }

const DefaultState: ExElementState = {
    caretIndex: 0,
    selectionStartIndex: -1,
    selectionEndIndex: -1,
    containsCaret: true,
    type: "Bracket",
    items: [
        {
            caretIndex: -1,
            selectionStartIndex: -1,
            selectionEndIndex: -1,
            containsCaret: false,
            type: "Symbol",
            symbol: 'A',
            isComplex: false,
            height: -1,
            width: -1
        },
        {
            caretIndex: -1,
            selectionStartIndex: -1,
            selectionEndIndex: -1,
            containsCaret: false,
            type: "Symbol",
            symbol: 'B',
            isComplex: false,
            height: -1,
            width: -1
        },
        {
            caretIndex: -1,
            selectionStartIndex: -1,
            selectionEndIndex: -1,
            containsCaret: false,
            type: "Symbol",
            symbol: 'C',
            isComplex: false,
            height: -1,
            width: -1
        }
    ],
    isComplex: true,
    height: -1,
    width: -1
}

const removeCaret = (state: ExElementState) => {
    state.caretIndex = -1;
    state.containsCaret = false;
    if (state.isComplex) {
        state.items.forEach(item => {
            removeCaret(item as ExElementState);
        })
    }
    return state;
}

const setCaret = (clientX: number, state: ExElementState) => {
    // default caret position is before first element
    state.caretIndex = 0;
    state.containsCaret = true;

    // click before first element
    if (clientX <= 0) {
        return state;
    }

    // complex case
    if (state.isComplex && !state.items.length) {
        // empty container
        return state;
    }
    if (state.isComplex) {
        let width = 0;
        let index = 0;
        while (width < clientX && index < state.items.length) {
            const item = state.items[index];
            width += item.width > 0 ? item.width : 0;
            index++;
        }

        index--;// roll back
        const caretItem = state.items[index];
        const caretItemWidth = caretItem.width > 0 ? caretItem.width : 0;
        const widthPriorCaretItem = width - caretItemWidth;
        const caretExtent = clientX - widthPriorCaretItem;
        if (caretItem.isComplex) {
            state.containsCaret = false;
            setCaret(caretExtent, caretItem as ExElementState);
        }

        state.caretIndex = caretExtent < caretItemWidth / 2 ? index : index + 1;

        return state;
    }

    // simple case
    if (state.width > 0) {
        state.caretIndex = clientX < state.width / 2 ? 0 : 1;
    } else {
        state.caretIndex = 1;
    }
    state.containsCaret = true;

    return state;
}

const insertSymbol = (state: ExElementState, key: string) => {

    if (state.containsCaret && state.caretIndex > -1) {
        if (state.isComplex) {
            const symbolState: ExElementState = {
                type: 'Symbol',
                symbol: key,
                containsCaret: false,
                caretIndex: -1,
                selectionStartIndex: -1,
                selectionEndIndex: -1,
                isComplex: false,
                width: -1,
                height: -1,
            };
            state.items.splice(state.caretIndex, 0, symbolState)
            state.caretIndex++;
        } else {
            // is it possible?
        }
        return state;
    }

    if (state.caretIndex > -1) {
        if (state.isComplex) {
            // insertSymbol()
        }else {

        }

    }

    return state;
}

export const StateHelper: {
    defaultState: (state?: ExElementState) => ExElementState;
    moveCaret: (state: ExElementState, move: 1 | -1) => ExElementState;
    backspaceCaret: (state: ExElementState, move: 1 | -1) => ExElementState;
    deleteCaret: (state: ExElementState, move: 1 | -1) => ExElementState;
    toState: (elem: ExElement) => ExElementState;
    setCaretAtPixel: (clientX: number, state: ExElementState) => ExElementState;
    insertSymbol: (state: ExElementState, key: string) => ExElementState;
} = {
    defaultState: (state?: ExElementState) => {
        //TODO: implement, check
        return state ? {...state, ...DefaultState} : DefaultState;
    },
    toState: elem => {
        //TODO: implement, check
        const state: ExElementState = {...DefaultState, ...elem} as ExElementState;
        return state;
    },
    moveCaret: (state: ExElementState, move: 1 | -1) => {
        if (state.isComplex && state.containsCaret) {
            if (state.caretIndex + move >= 0 && state.caretIndex + move <= state.items.length) {
                state.caretIndex += move;
            }
        } else if (state.isComplex) {
            state.items.findIndex((t => t.caretIndex))
        }
        return state;
    },
    backspaceCaret: (state: ExElementState) => {
        if (state.containsCaret) {
            
            if (state.caretIndex > 0 && state.isComplex) {
                state.items.splice(state.caretIndex - 1, 1);
                state.caretIndex -= 1;

            }
        }
        return state;
    },
    deleteCaret: (state: ExElementState) => {
        if (state.containsCaret && state.isComplex) {
            if (state.caretIndex >= 0 && state.caretIndex < state.items.length) {
                state.items.splice(state.caretIndex, 1);
                
            }
        }
        return state;
    },
    setCaretAtPixel: (clientX: number, state: ExElementState) => {
        return setCaret(clientX, removeCaret(state));
    },
    insertSymbol
}