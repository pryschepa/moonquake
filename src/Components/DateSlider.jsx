import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { dateToDays, daysToDate, dateToStr, moonquakeDataToDate } from './Three/utils';

const DateSlider = ({ minDate, maxDate, onDateChange, marks }) => {
  const [startDate, setStartDate] = useState(dateToDays(minDate));
  const [endDate, setEndDate] = useState(dateToDays(minDate));
  const [dateMarks, setDateMarks] = useState([]);

  useEffect(() => {
    const updatedDateMarks = marks.map(mark => dateToDays(moonquakeDataToDate(mark)));

    setDateMarks(updatedDateMarks);
  }, []);

  const handleStartDateChange = (newStartDate) => {
    if (newStartDate <= endDate) {
      setStartDate(newStartDate);
      onDateChange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    if (newEndDate >= startDate) {
      setEndDate(newEndDate);
      onDateChange(startDate, newEndDate);
    }
  };

  return (
    <>
      <div className='dateSliderSpans'>
        <span>Start Date: {dateToStr(daysToDate(startDate))}</span>
        <span>End Date: {dateToStr(daysToDate(endDate))}</span>
      </div>
      <Slider
        min={dateToDays(minDate)}
        max={dateToDays(maxDate)}
        value={[startDate, endDate]}
        marks={{
            // dateMarks
        }}
        onChange={(value) => {
          handleStartDateChange(value[0]);
          handleEndDateChange(value[1]);
        }}
        range
      />
    </>
  );
};

export default DateSlider;
