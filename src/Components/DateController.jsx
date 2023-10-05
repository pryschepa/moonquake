import { useState, useEffect } from "react";


function DateController(props){
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const date = new Date(0); 

        date.setFullYear(props.Year); // Set the year
        date.setDate(props.Day); // Set the day of the year
        date.setHours(props.H); // Set the hours
        date.setMinutes(props.M); // Set the minutes
        date.setSeconds(props.S); // Set the seconds

        setCurrentDate(date); 

        date.get
    }, []);

    function incrementDate(){
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate); 
        
        props.onDateChange(currentDate);
    }

    function decrementDate(){
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);

        props.onDateChange(currentDate);
    }

    return (<>
        <button onClick={decrementDate}>-</button>
        <div className="white">{`${currentDate.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentDate.getMonth()]}, ${currentDate.getFullYear()}`}</div>
        <button onClick={incrementDate}>+</button>
    </>)
}

export default DateController;