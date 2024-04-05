import React, { useState, useEffect } from 'react';

const Timer = ({ cd, onTimeChange }) => {

    const hours = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, '0'));

    // console.log(hours,minutes)

    const [color1, setColor1] = useState({ bg: 'none', text: 'black' });
    const [color2, setColor2] = useState({ bg: 'none', text: 'black' });
    const [ampm, setAmpm] = useState('AM');
    const [hr, setHr] = useState(hours[0]);
    const [min, setMin] = useState(minutes[0]);

    // useEffect(() => {
    //     let currDt = new Date()
    //     let currHr = currDt.getHours()
    //     let currMin = currDt.getMinutes()
    //     if (currHr >= 12) {
    //         setAmpm('PM')
    //     }
    //     console.log(typeof(hours[0]))
    //     console.log(typeof((currHr) % 12).toString().padStart(2, '0'))
    //     console.log(((currHr) % 12).toString().padStart(2, '0'))

    //     let idxHr = hours.findIndex(hr => ((parseInt(currHr) % 12) + 1).toString().padStart(2, '0') === hr)
    //     let idxMin = minutes.findIndex(min => ((parseInt(currMin) % 12) + 1).toString().padStart(2, '0') === min)
    //     // console.log(hours.findIndex((currHr) % 12).toString().padStart(2, '0'))

    //     console.log(idxHr,idxMin);
    //     console.log(hours[idxHr-1],minutes[idxMin-1]);
    //     setHr(hours[idxHr])
    //     setMin(minutes[idxMin])
    // }, [])


    const handleColorChange1 = () => {
        setColor1({ bg: 'black', text: 'white' });
        setColor2({ bg: 'none', text: 'black' });
        setAmpm('AM');
        onTimeChange(hr, min, 'AM');
    };

    const handleColorChange2 = () => {
        setColor2({ bg: 'black', text: 'white' });
        setColor1({ bg: 'none', text: 'black' });
        setAmpm('PM');
        onTimeChange(hr, min, 'PM');
    };

    const handleHrChange = (e) => {
        setHr(e.target.value);
        onTimeChange(e.target.value, min, ampm);
    }

    const handleMinChange = (e) => {
        setMin(e.target.value);
        onTimeChange(hr, e.target.value, ampm);
    }

    return (
        <div className='bg-white px-3 rounded-xl flex gap-2 items-center justify-between max-14inch:w-full '>
            <div className=' text-[3rem] flex items-center'>
                <div>
                    <select onChange={(e) => handleHrChange(e)} className='appearance-none outline-none cursor-pointer'>
                        {/* <option selected="selected" className='text-sm text-center font-bold bg-[#cfcfcf]'>
                            {((new Date().getHours()) % 12).toString().padStart(2, '0')}
                        </option> */}
                        {hours.map((hr, index) => (
                            <option key={index} className='text-sm text-center'>
                                {hr}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='pb-2'>:</div>
                <div>
                    <select onChange={(e) => handleMinChange(e)} className='appearance-none outline-none cursor-pointer'>
                        {/* <option selected="selected" className='text-sm text-center font-bold bg-[#cfcfcf]'>
                            {(new Date().getMinutes()).toString().padStart(2, '0')}
                        </option> */}
                        {minutes.map((min, index) => (
                            <option key={index} className='text-sm text-center'>
                                {min}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='flex flex-col gap-1 max-14inch:flex-row max-14inch:gap-3 max-14inch:mr-2'>
                <div
                    onClick={handleColorChange1}
                    className={`border px-2 border-black max-14inch:p-2 max-14inch:rounded-md max-14inch:text-3xl rounded-full cursor-pointer ${ampm === 'AM'
                        ? 'bg-black text-white'
                        : `bg-${color1.bg} text-${color1.text}`
                        }`}
                >
                    AM
                </div>
                <div
                    onClick={handleColorChange2}
                    className={`border px-2 border-black max-14inch:p-2 max-14inch:rounded-md max-14inch:text-3xl rounded-full cursor-pointer ${ampm === 'PM'
                        ? 'bg-black text-white'
                        : `bg-${color2.bg} text-${color2.text}`
                        }`}
                >
                    PM
                </div>
            </div>
        </div>
    );
};

export default Timer;
// export {hr,min,ampm}
