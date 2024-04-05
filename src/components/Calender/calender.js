import dayjs from "dayjs";

export const generateDate = (month = dayjs().month(), year = dayjs().year()) => {
    const firstDateOfTheMonth = dayjs().year(year).month(month).startOf("month");
    const lastDateOfTheMonth = dayjs().year(year).month(month).endOf("month");

    const arrOfDate = [];

    //generate prefix date
    for(let i = 0 ; i< firstDateOfTheMonth.day() ; i++){
        arrOfDate.push({
            date : firstDateOfTheMonth.day(i), 
            current_month : false
        });
    }

    //generate current date
    for(let i = firstDateOfTheMonth.date() ; i<=lastDateOfTheMonth.date() ; i++){
        arrOfDate.push({
            date : firstDateOfTheMonth.date(i),
            current_month : true,
            today : firstDateOfTheMonth.date(i).toDate().toDateString() === dayjs().toDate().toDateString()
        });
    }

    const remaining = 42 - arrOfDate.length;

    //generate suffix date
    for(let i = lastDateOfTheMonth.day() + 1 ; i<=lastDateOfTheMonth.day() + remaining ; i++){
        arrOfDate.push({
            date : lastDateOfTheMonth.day(i),
            current_month : false
            });
    }

    return arrOfDate;
}

export const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];