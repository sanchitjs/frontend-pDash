import React, { useState } from 'react';
import dayjs from "dayjs";
import { GrNext, GrPrevious } from "react-icons/gr";
import { generateDate, months } from "./calender";
import cn from "./cn";

const Calender = ({onDateChange}) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectedDate, setSelectedDate] = useState(today);

    const handlePrevMonth = () => {
        setToday(today.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setToday(today.add(1, 'month'));
    };

    const handleResetToday = () => {
        setToday(currentDate);
        setSelectedDate(currentDate);
        onDateChange(currentDate);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    return (
        <div className=" w-full pt-4 px-6  max-[768px]:px-4 rounded-lg flex flex-col gap-2">

            <div className='bg-white p-2 rounded-xl flex gap-4 justify-between'>
                <div className="text-center text-2xl ml-2 max-[768px]:text-[16px]">
                    <h1>{months[today.month()] + " " + today.year()} </h1>
                </div>
                <div className="flex justify-end items-center gap-2  max-[768px]:text-sm">
                    <div className="cursor-pointer" onClick={handlePrevMonth}><GrPrevious /></div>
                    <div onClick={handleResetToday} className="cursor-pointer hover:bg-gray-200 w-fit px-1 rounded-md">Today</div>
                    <div className="cursor-pointer" onClick={handleNextMonth}><GrNext /></div>
                </div>

            </div>

            <div className='bg-white p-2 rounded-xl'>
                <div className="grid grid-cols-7 py-3 w-full font-normal max-[768px]:text-sm">
                    {days.map((day, index) => (
                        <div className="flex justify-center" key={index}><h1>{day}</h1></div>
                    ))}
                </div>

                <div className="grid grid-cols-7 w-full">
                    {generateDate(today.month(), today.year()).map(({ date, current_month, today }, index) => (
                        <div key={index} className="h-10  border-t flex justify-center items-center cursor-pointer max-[768px]:text-sm max-[768px]:h-7">
                            <h1
                                onClick={() => handleDateClick(date)}
                                className={cn(
                                    current_month ? "" : "text-gray-400",
                                    // (dayjs().month() === date.month()) ? (selectedDate.date() == date.date()) ? "bg-black text-white" : today ? "bg-[#fea920]" : "hover:bg-gray-200" : "hover:bg-gray-200",
                                    (selectedDate.date() === date.date() && selectedDate.month() === date.month() && selectedDate.year() === date.year()) ? "bg-black text-white" : today ? "bg-[#fea920]" : "hover:bg-gray-200",
                                    "h-8 w-8  max-[768px]:size-6 flex justify-center items-center rounded-full transition-all duration-200"
                                )}
                            >
                                {date.date()}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calender;