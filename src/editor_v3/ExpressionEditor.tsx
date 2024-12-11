import React, { useEffect, useState } from "react";
import { EcElement } from "./EcElement";
import { StateHelper } from "./Helper";
import { ExElementState } from "./Model";
import * as Sentry from "@sentry/react";

var focusedHandler: boolean = false;// needed to bind state to the function

const setOnSizeRecursive = (subState: ExElementState, state: ExElementState, setState: React.Dispatch<React.SetStateAction<ExElementState>>) => {
    subState.onSize = (width, height) => {
        if (subState.width != width || subState.height != height) {
            subState.width = width;
            subState.height = height;
            setState({...state});
        }
    }
    if (subState.isComplex) {
        subState.items.forEach(item => {
            setOnSizeRecursive(item as ExElementState, state, setState);
        })
    }
}

export const ExpressionEditor: React.FC = () => {

    const [state, setState] = useState<ExElementState>(StateHelper.defaultState());
    setOnSizeRecursive(state, state, setState);

    //console.log(state)

    const [focused, setFocused] = React.useState<boolean>(false)
    focusedHandler = focused;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { // this function is created just once
            if (!focusedHandler) return;

            // console.log(`focused: ${focusedHandler}`);
            // console.log(`Key pressed: ${event.key}`);

            switch (event.key) {
                case 'ArrowRight':
                    setState({...StateHelper.moveCaret(state, 1)});
                    break;
                case 'ArrowLeft':
                    setState({...StateHelper.moveCaret(state, -1)});
                    break;
                case 'Backspace':
                     setState({...StateHelper.backspaceCaret(state, -1)});
                    break;
                case 'Delete':
                    setState({...StateHelper.deleteCaret(state, 1)});
                    break;
                default:
                    if (event.key.length === 1 && /^[a-zA-Z0-9\+\-\(\)\)]$/.test(event.key)) {
                        setState({...StateHelper.insertSymbol(state, event.key)})
                    } else {
                        // notify about bad symbol?
                    }
                    break;
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const CallError = () => {
        // Sentry.addBreadcrumb({
        //     category: 'ui.click',
        //     message: 'User clicked on "Submit"',
        //     level: 'info',
        // });
        
        Sentry.setUser({
            id: '12345',
            username: 'JohnDoe',
            email: 'johndoe@example.com',
        });

        Sentry.captureException('123!', {
            fingerprint: ['error-123'],
        });

        // Sentry.setContext('OrderInfo', {
        //     orderId: '67890',
        //     orderStatus: 'Processing',
        // });
        throw new Error('123!');
    }


    return <>
        <h5>Expression Editor:</h5>
        <button className="error-button" onClick={CallError}>Call Error</button>
        <button onClick={() => setFocused(!focused)}
                style={{background: focused ? "blue" : undefined, color: focused ? "white" : undefined}}>
            Focus
        </button>
        <div style={{borderColor: focused ? "blue" : "black", borderWidth: "1px", borderStyle: 'solid'}}
             onClick={(e) => {
                 
                 setState({...StateHelper.setCaretAtPixel(e.clientX, state)});
                 if (!focused) {
                     setFocused(true);
                 }
             }}
        >
            <EcElement {...state}/>
        </div>
    </>
}