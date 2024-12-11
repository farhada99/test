import React, { useState, useRef } from 'react';
import VerticalLine from './custom-cursor';



interface CustomFlexRowProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onUpdateChildren?: (updatedChildren: React.ReactNode[]) => void;
}

const CustomFlexRow: React.FC<CustomFlexRowProps> = ({
    children,
    className = '',
    style = {},
    onUpdateChildren,
}) => {
    const [localChildren, setLocalChildren] = useState(React.Children.toArray(children));
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const itemRefs = useRef<HTMLDivElement[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (!itemRefs.current[index]) return;

        switch (e.key) {
            case 'ArrowRight':
                if (index + 1 < itemRefs.current.length) {
                    setFocusedIndex(index + 1);
                    itemRefs.current[index + 1]?.focus();
                }
                break;
            case 'ArrowLeft':
                if (index - 1 >= 0) {
                    setFocusedIndex(index - 1);
                    itemRefs.current[index - 1]?.focus();
                }
                break;
            case 'Backspace':
                e.preventDefault();
                const updatedChildren = localChildren.filter((_, i) => i !== index);
                setLocalChildren(updatedChildren);
                onUpdateChildren?.(updatedChildren); 

                
                if (index > 0) {
                    setFocusedIndex(index - 1);
                    itemRefs.current[index - 1]?.focus();
                } else if (index < updatedChildren.length) {
                    setFocusedIndex(index);
                    itemRefs.current[index]?.focus();
                } else {
                    setFocusedIndex(null);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={`custom-flex-row ${className}`}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                border: '1px solid black',
                padding: '10px',
                boxSizing: 'border-box',
                ...style,
            }}
        >
            {localChildren.map((child, index) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement, {
                        ref: (el: HTMLDivElement) => (itemRefs.current[index] = el),
                        tabIndex: 0, 
                        onFocus: () => setFocusedIndex(index),
                        onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
                        style: {
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            contentEditable: true,
                            border: focusedIndex === index ? '2px solid #2986cc' : '1px solid grey',
                            borderRadius: '5px',
                            backgroundColor:
                                focusedIndex === index
                                    ? 'rgba(0, 191, 255, 0.3)'
                                    : 'rgba(173, 216, 230, 0.5)',
                            padding: '5px',
                            outline: 'none',
                            transition: 'border-color 0.2s, background-color 0.2s',
                            cursor: 'pointer',
                            ...(child.props.style || {}),
                        },
                    })
                    : child
            )}
            {focusedIndex !== null && itemRefs.current[focusedIndex] && (
                <VerticalLine
                    style={{
                        
                        position: 'absolute',
                        left: `${
                            itemRefs.current[focusedIndex].offsetLeft +
                            itemRefs.current[focusedIndex].offsetWidth
                        }px`,
                    }}
                />
            )}
        </div>
    );
};

export default CustomFlexRow;
