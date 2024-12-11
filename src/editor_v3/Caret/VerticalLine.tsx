import React from 'react';

interface VerticalLineProps {
    height?: number;
    color?: string;
    width?: number;
    style?: React.CSSProperties;
}

export const isNumeric = (width?: string | number) => {
    if (typeof width === "number") {
        return true;
    }
    if (typeof width === "string") {
        const trimmed = width.trim();
        return /^[+-]?\d+(\.\d+)?$/.test(trimmed);
    }
    return false;
}

export const VerticalLine: React.FC<VerticalLineProps> = ({
                                                              height = 40,
                                                              color = 'black',
                                                              width = 1,
                                                              style = {},
                                                          }) => {
    const keyframes = `
        @keyframes fadeBlink {
            0% { opacity: 1; }
            50% { opacity: 0.1; }
            100% { opacity: 1; }
        }
    `;

    const animationStyle = document.createElement('style');
    if (!document.querySelector('#fadeBlink-animation')) {
        animationStyle.id = 'fadeBlink-animation';
        animationStyle.textContent = keyframes;
        document.head.appendChild(animationStyle);
    }

    return (
        <div style={{
            position: "relative",
            width: 0,
            height: 0
        }}>
            <span
                style={{
                    content: "",
                    position: "absolute",
                    left: 0,
                    top: (-height / 2) + 'px',
                    width: width + 'px',
                    height: height + 'px',
                    backgroundColor: color ?? "black",
                    display: 'inline-block',
                    // position: 'relative',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    animation: 'fadeBlink 1s infinite',
                    color: color,
                    ...style,
                }}/>
        </div>
    );
};

export default VerticalLine;
