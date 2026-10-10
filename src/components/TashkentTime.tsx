import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function TashkentTime() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      // Toshkent vaqti UTC+5
      const now = new Date();
      const tashkentTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
      
      const hours = tashkentTime.getHours().toString().padStart(2, '0');
      const minutes = tashkentTime.getMinutes().toString().padStart(2, '0');
      const seconds = tashkentTime.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
      ];
      const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      
      const dayName = days[tashkentTime.getDay()];
      const day = tashkentTime.getDate();
      const month = months[tashkentTime.getMonth()];
      const year = tashkentTime.getFullYear();
      
      setDate(`${dayName}, ${day} ${month} ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-gray-300">Toshkent, O'zbekiston</span>
      </div>
      <div className="flex items-center gap-3">
        <Clock size={20} className="text-purple-400" />
        <div>
          <p className="text-2xl font-bold text-white font-mono">{time}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">UTC+5 | O'zbekiston vaqti</p>
    </div>
  );
}
