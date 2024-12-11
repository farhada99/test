import React from 'react';

interface VerticalLineProps {
    height?: string | number;
    color?: string;
    width?: string | number;
    style?: React.CSSProperties;
}

const VerticalLine: React.FC<VerticalLineProps> = ({
    height = '30px',
    color = 'black',
    width = '1px',
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
        <div
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                backgroundColor: color,
                display: 'inline-block',
                position: 'relative',
                marginLeft: '3px',
                zIndex: 9999,
                pointerEvents: 'none',
                userSelect: 'none',
                animation: 'fadeBlink 1s infinite',
                color:color,
                ...style,
            }}
         />
    );
};

export default VerticalLine;
