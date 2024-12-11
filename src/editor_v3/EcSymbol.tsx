import React from "react";
import {ExElementState, ExSymbol} from "./Model";

export const EcSymbol: React.FC<ExElementState> = (props) => {
    return <>
            <h1>{props.type == "Symbol" ? props.symbol : ''}</h1>
    </>
}