import { forwardRef, useRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, ...props },
    ref,
) {
    const localRef = useRef(null);

    return (
        <select
            {...props}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={ref || localRef}
        >
            {children}
        </select>
    );
});
