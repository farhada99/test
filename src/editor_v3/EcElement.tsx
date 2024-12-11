import {EcEmpty} from "./EcEmpty";
import {EcSymbol} from "./EcSymbol";
import React from "react";
import {ExElementState} from "./Model";
import VerticalLine from "./Caret/VerticalLine";
import {SizedBox} from "./SizedBox";

export const EcElement: React.FC<ExElementState> = (props) => {
    return <>
        <SizedBox onSize={(width, height) => {
            // console.log(width, height)
            if (props.onSize) {
                props.onSize(width, height);
            }
        }}>
            {
                props.type == 'Symbol' ? <EcSymbol {...props}/> :
                    !(props.isComplex && props.items.length) ? <EcEmpty/> :
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            {
                                props.items.map((item, index) =>
                                    (
                                        <>
                                            {
                                                props.containsCaret && index === props.caretIndex ? <>
                                                        <VerticalLine height={props.height > 0 ? props.height*0.8 : undefined}/>
                                                    </> :
                                                    <></>
                                            }
                                            <EcElement key={index} {...item as ExElementState}/>
                                        </>
                                    ))
                            }
                            {
                                props.containsCaret && props.items.length === props.caretIndex ? <>
                                        <VerticalLine height={props.height > 0 ? props.height*0.8 : undefined}/>
                                    </> :
                                    <></>
                            }
                        </div>
            }
        </SizedBox>
    </>
}