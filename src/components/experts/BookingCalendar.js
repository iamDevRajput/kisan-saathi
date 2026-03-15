// src/components/experts/BookingCalendar.js
'use client';
import React, { useState } from 'react';
import { format, addDays, startOfToday, endOfToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingCalendar({ availableDays = {}, onSelectDate }) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const today = startOfToday();

  // Generate 7 days based on offset
  const days = [...Array(7)].map((_, i) => addDays(today, (currentWeekOffset * 7) + i));

  const handleNextWeek = () => {
    if (currentWeekOffset < 3) setCurrentWeekOffset(prev => prev + 1);
  };

  const handlePrevWeek = () => {
    if (currentWeekOffset > 0) setCurrentWeekOffset(prev => prev - 1);
  };

  const isAvailable = (date) => {
    const dayName = format(date, 'EEEE').toLowerCase();
    // In a real app, you'd check specific dates, here we check the day of the week
    const slots = availableDays[dayName];
    return slots && slots.length > 0;
  };

  const handleSelect = (date) => {
    if (isAvailable(date)) {
      setSelectedDate(date);
      if (onSelectDate) onSelectDate(date);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">Select Date</h4>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevWeek} 
            disabled={currentWeekOffset === 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-600 self-center">
            {format(days[0], 'MMM yyyy')}
          </span>
          <button 
            onClick={handleNextWeek}
            disabled={currentWeekOffset >= 3}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 pb-2">
            {day}
          </div>
        ))}
        
        <AnimatePresence mode="wait">
          {days.map((date, i) => {
            const available = isAvailable(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);

            return (
              <motion.button
                key={`${currentWeekOffset}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                disabled={!available}
                onClick={() => handleSelect(date)}
                className={`
                  flex flex-col items-center justify-center py-2 md:py-3 rounded-lg border-2 transition-all
                  ${!available ? 'opacity-40 cursor-not-allowed border-transparent bg-gray-50' : ''}
                  ${available && !isSelected ? 'border-gray-100 bg-white hover:border-green-200 hover:bg-green-50' : ''}
                  ${isSelected ? 'border-green-600 bg-green-600 text-white shadow-md' : 'text-gray-800'}
                `}
              >
                <span className={`text-xs md:text-sm mb-1 ${isSelected ? 'text-green-100' : (isToday ? 'text-green-600 font-bold' : 'text-gray-500')}`}>
                  {isToday ? 'Today' : format(date, 'eee')}
                </span>
                <span className={`text-lg md:text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {format(date, 'd')}
                </span>
                {available && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
