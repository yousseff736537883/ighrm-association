import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './WorldClock.css';

function WorldClock() {
  const [times, setTimes] = useState([]);

  const timeZones = [
    { name: 'المغرب', timezone: 'Africa/Casablanca', flag: '🇲🇦' },
    { name: 'مصر', timezone: 'Africa/Cairo', flag: '🇪🇬' },
    { name: 'السعودية', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
    { name: 'الإمارات', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    { name: 'لندن', timezone: 'Europe/London', flag: '🇬🇧' },
    { name: 'باريس', timezone: 'Europe/Paris', flag: '🇫🇷' },
    { name: 'نيويورك', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: 'طوكيو', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'سيدني', timezone: 'Australia/Sydney', flag: '🇦🇺' },
    { name: 'دبي', timezone: 'Asia/Dubai', flag: '🏙️' },
    { name: 'بانكوك', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
    { name: 'سنغافورة', timezone: 'Asia/Singapore', flag: '🇸🇬' }
  ];

  useEffect(() => {
    const updateTimes = () => {
      const currentTimes = timeZones.map(zone => {
        const formatter = new Intl.DateTimeFormat('ar-MA', {
          timeZone: zone.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        
        const time = formatter.format(new Date());
        
        // Get date info
        const dateFormatter = new Intl.DateTimeFormat('ar-MA', {
          timeZone: zone.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        const date = dateFormatter.format(new Date());

        return {
          ...zone,
          time,
          date
        };
      });

      setTimes(currentTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="world-clock-container">
      <div className="container">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="clock-title"
        >
          🌍 الساعة العالمية
        </motion.h1>

        <p className="clock-subtitle">
          اعرف الوقت الحالي في أهم المدن والعواصم حول العالم
        </p>

        <motion.div 
          className="clocks-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {times.map((zone, index) => (
            <motion.div 
              key={zone.timezone}
              className="clock-card"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="clock-header">
                <span className="clock-flag">{zone.flag}</span>
                <h3 className="clock-city">{zone.name}</h3>
              </div>

              <div className="clock-display">
                <div className="digital-time">
                  {zone.time}
                </div>
              </div>

              <div className="clock-date">
                📅 {zone.date}
              </div>

              <div className="clock-analog">
                <AnalogClock time={zone.time} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Current Time Info */}
        <motion.section 
          className="current-time-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2>معلومات الوقت الحالي</h2>
          <div className="info-grid">
            <div className="info-card">
              <span className="info-icon">🕐</span>
              <span className="info-label">الوقت العالمي المنسق</span>
              <span className="info-value">{new Date().toUTCString().split(' ')[4]}</span>
            </div>
            <div className="info-card">
              <span className="info-icon">📍</span>
              <span className="info-label">منطقتك الزمنية</span>
              <span className="info-value">
                UTC{new Date().toLocaleString('en-US', {timeZoneName: 'short'}).match(/UTC[+-]\d+:\d+/)?.[0] || 'GMT'}
              </span>
            </div>
            <div className="info-card">
              <span className="info-icon">📆</span>
              <span className="info-label">التاريخ الهجري</span>
              <span className="info-value">{getHijriDate()}</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// Analog Clock Component
function AnalogClock({ time }) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours % 12 / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="analog-clock">
      <div className="clock-face">
        <div 
          className="hand hour-hand" 
          style={{ transform: `rotate(${hourDegrees}deg)` }}
        ></div>
        <div 
          className="hand minute-hand" 
          style={{ transform: `rotate(${minuteDegrees}deg)` }}
        ></div>
        <div 
          className="hand second-hand" 
          style={{ transform: `rotate(${secondDegrees}deg)` }}
        ></div>
        <div className="center-dot"></div>
      </div>
    </div>
  );
}

// Helper function to get Hijri date
function getHijriDate() {
  const today = new Date();
  const jd = Math.floor((today / 86400000) - (today.getTimezoneOffset()/1440) + 2440587.5);
  let l = jd + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  let d = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  let m = j + 2 - (12 * l);
  let y = (100 * (n - 49)) + i + l;
  
  const hijri_y = Math.floor((y * 10631 + 9898) / 10631);
  const hijri_m = Math.floor(((((y * 10631 + 9898) % 10631) / 10631) * 12) + 0.5) + 1;
  const hijri_d = d;

  return `${hijri_d}/${hijri_m}/${hijri_y}`;
}

export default WorldClock;