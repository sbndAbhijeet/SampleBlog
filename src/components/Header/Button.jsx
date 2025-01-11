import React from 'react'

export default function Button({
    children,// this is children is similar to some text which will appear just for naming purpose children
    type='button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props //any other if required
}) {
    

    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    )
}
