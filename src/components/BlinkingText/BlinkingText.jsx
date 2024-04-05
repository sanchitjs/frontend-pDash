// import React, { useState, useEffect } from 'react';

// const BlinkingText = ({ data ,childElement }) => {
//   const [blink, setBlink] = useState(false);
//   const text = "h"

//   // Toggle the blink state every time the text changes
//   useEffect(() => {
//     setBlink(true);
//     const timeout = setTimeout(() => {
//       setBlink(false);
//     }, 1000); // Adjust the duration to match your animation duration
//     return () => clearTimeout(timeout);
//   }, [text]);

//   useEffect(() => {
//     console.log(data?.BV, data?.OT);
//   }, [data])


//   return <div className={`${blink ? 'blink default' : 'default'}`}>{text}</div>;
// };

// export default BlinkingText;

import React, { useState, useEffect } from 'react';

const BlinkingText = ({ data, childElement, color }) => {
    const [blink, setBlink] = useState(false);

    // Toggle the blink state when data.BV or data.OT changes
    useEffect(() => {
        if (data) {
            setBlink(true);
            const timeout = setTimeout(() => {
                setBlink(false);
            }, 1000); // Adjust the duration to match your animation duration
            return () => clearTimeout(timeout);
        }
    }, [data.BV, data.OT]);

    return (
        <div className={`${blink ? `blink${color} default ${color}`  : `default ${color}`}`}>
            <div >
                {/* Render the child element passed as prop */}
                {childElement}
            </div>
        </div>
    );
};

export default BlinkingText;
