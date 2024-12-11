import React, {useEffect, useRef, useState} from "react";

export const SizedBox: React.FC<React.PropsWithChildren<{
    onSize?: (width: number, height: number) => void
}>> = (props) => {

    const divRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({width: -1, height: -1});

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === divRef.current) {
                    const {width, height} = entry.contentRect;
                    if (width == dimensions.width && height == dimensions.height) return;
                    setDimensions({width, height});
                    if (props.onSize) {
                        props.onSize(width, height);
                    }
                }
            }
        });

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current);
            }
        };
    }, []);

    return <div
        ref={divRef}
        style={{
            display: 'inline-block',
        }}
    >
        {props.children}
    </div>
}