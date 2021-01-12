import React from 'react'

export const Loader = () => {
    return (
        <div
            style={{
                display: 'flex',
                paddingTop: '2rem'
            }}
        >
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        </div>
    )
}
