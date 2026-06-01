/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Printer, Ticket, User, Home, Calendar, Coffee, Utensils, Info, ExternalLink } from 'lucide-react';

export default function App() {
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  });
  const [vcNo, setVcNo] = useState('');
  const [printedBy, setPrintedBy] = useState(() => {
    return localStorage.getItem('printedBy') || '056-Gor';
  });
  const [numVouchers, setNumVouchers] = useState(1);

  // Save printedBy to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('printedBy', printedBy);
  }, [printedBy]);

  // Sync VC NO with Date and Room Number automatically
  useEffect(() => {
    // Expected format: DD/MM/YY or DD/MM/YYYY
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
    const match = date.trim().match(datePattern);
    
    let datePrefix = '20260517'; // Default if no date
    
    if (match) {
      const [_, day, month, year] = match;
      const formattedDay = day.padStart(2, '0');
      const formattedMonth = month.padStart(2, '0');
      let fullYear = year.length === 2 ? `20${year}` : year;
      datePrefix = `${fullYear}${formattedMonth}${formattedDay}`;
    }

    // Sync VC NO using datePrefix and roomNumber
    const newVcNo = roomNumber ? `${datePrefix}-${roomNumber}` : `${datePrefix}-`;
    
    // Only update if it actually changed to prevent cursor jumps
    setVcNo(newVcNo);
  }, [date, roomNumber]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error('Print error:', e);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-gray-50">
      {/* UI Controls - Hidden during print */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="no-print w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Breakfast Voucher Master</h1>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <span className="text-sm font-medium px-2">กี่ท่าน:</span>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setNumVouchers(num)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                  numVouchers === num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">ชื่อลูกค้า (GUEST NAME)</label>
            <input 
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ชื่อลูกค้า"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">ชื่อพนักงาน/รหัส (PRINTED BY)</label>
            <input 
              type="text"
              value={printedBy}
              onChange={(e) => setPrintedBy(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-orange-600"
              placeholder="ชื่อพนักงาน"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={openInNewTab}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-orange-100 cursor-pointer border-2 border-orange-400"
          >
            <ExternalLink className="w-6 h-6" /> 1. เปิดแอปในหน้าต่างใหม่
          </button>

          <button 
            type="button"
            onClick={handlePrint}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-blue-100 cursor-pointer"
          >
            <Printer className="w-6 h-6" /> 2. กดพิมพ์ (เด้งแน่นอน)
          </button>
        </div>


      </motion.div>

      {/* Voucher Preview / Print Layout */}
      <div className="flex flex-col items-center">
        <div 
          ref={printRef}
          className="print-container flex flex-col items-center gap-4 pt-0 pb-10"
        >
          {Array.from({ length: numVouchers }).map((_, index) => (
            <div 
              key={index}
              className={`bg-white w-[320px] min-h-[500px] pt-1 px-4 pb-4 relative flex flex-col items-center border border-gray-200 print:border-none shadow-2xl print:shadow-none ${index < numVouchers - 1 ? 'print:border-b-2 print:border-dashed print:border-gray-300' : ''}`}
              style={{ fontFamily: "'Sarabun', 'Prompt', sans-serif" }}
            >
              {/* Header */}
              <div className="text-center mb-4 w-full border-b border-dashed border-gray-300 pb-3">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">House & Home Residence</h2>
                <h3 className="text-lg font-medium mt-1">คูปองอาหารเช้า</h3>
                <h1 className="text-lg font-bold tracking-wider mt-0.5 uppercase text-gray-700">Breakfast Voucher</h1>
                <p className="text-[13px] text-gray-600 mt-1 font-semibold">เวลา 07:00 - 10:00 AM</p>
                <p className="text-[10px] text-gray-500 mt-1 italic">กรุณาเก็บคูปองไว้แสดงต่อพนักงานห้องอาหาร</p>
              </div>

              {/* Details Section */}
              <div className="w-full space-y-1 mb-4 text-[13px]">
                <div className="flex items-baseline border-b border-dotted border-gray-300 pb-1">
                  <div className="flex items-baseline flex-1 min-w-0">
                    <span className="font-bold whitespace-nowrap shrink-0">ห้อง/ROOM:</span>
                    <input 
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="ml-1 text-2xl font-black outline-none bg-transparent w-16 focus:bg-blue-50 text-blue-900 p-0 text-center"
                      placeholder="___"
                    />
                  </div>
                  <div className="flex items-baseline shrink-0">
                    <span className="font-bold whitespace-nowrap">วันที่/DATE:</span>
                    <input 
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="ml-1 font-bold outline-none bg-transparent text-right w-[82px] focus:bg-blue-50"
                      placeholder="../../.."
                    />
                  </div>
                </div>
                <div className="flex items-baseline border-b border-dotted border-gray-300 pb-1 pt-1">
                  <span className="font-bold shrink-0">ลูกค้า/GUEST:</span>
                  <input 
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="ml-2 font-bold uppercase outline-none bg-transparent flex-1 text-blue-900 focus:bg-blue-100 transition-colors"
                    placeholder="คลิกเพื่อพิมพ์ชื่อ..."
                  />
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-gray-500 text-[10px]">VC NO:</span>
                  <input 
                    type="text"
                    value={vcNo}
                    onChange={(e) => setVcNo(e.target.value)}
                    className="font-medium text-[10px] tabular-nums text-right outline-none bg-transparent focus:bg-gray-100"
                  />
                </div>
              </div>

              <div className="text-center mb-4 bg-gray-50 w-full py-1 rounded">
                <p className="text-[12px] font-medium">คูปอง 1 ใบสำหรับลูกค้า 1 ท่าน</p>
              </div>

              {/* Menu Table - Side by side for saving space */}
              <div className="w-full grid grid-cols-[1.4fr_1fr] gap-2 mb-4">
                {/* Food Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[14px] border-b border-gray-200 pb-0.5">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>เมนูอาหาร</span>
                  </div>
                  <ul className="space-y-2 text-[13px] pl-1 mt-1">
                    <li className="flex items-start gap-2">
                        <div className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                        <span>ข้าวต้ม (หมู/ไก่)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                        <span>ข้าวผัด (หมู/ไก่)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                        <span>ข้าวไข่เจียว (หมู/ไก่)</span>
                    </li>
                  </ul>
                </div>

                {/* Drinks Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[14px] border-b border-gray-200 pb-0.5">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>เครื่องดื่ม</span>
                  </div>
                  <ul className="space-y-2 text-[13px] pl-1 mt-1">
                    <li className="flex items-start gap-2">
                        <div className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                        <span>น้ำส้ม</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer Notes */}
              <div className="mt-auto pt-4 text-center w-full border-t border-dashed border-gray-300">
                <p className="text-[12px] font-bold text-gray-700">คูปองไม่สามารถแลกเปลี่ยนเป็นเงินสดได้</p>
                <p className="text-[10px] italic text-gray-500 mt-0.5 uppercase tracking-wider">This Voucher is Non-Refundable</p>
                <div className="pt-3 flex justify-between items-center w-full">
                   <p className="text-[9px] text-gray-400 font-mono tracking-tighter">
                    BY: <input type="text" value={printedBy} onChange={(e) => setPrintedBy(e.target.value)} className="outline-none bg-transparent w-32" />
                   </p>
                </div>
              </div>

              {/* Design Elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 -rotate-45 translate-x-8 -translate-y-8 opacity-50" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-50 -rotate-45 -translate-x-8 translate-y-8 opacity-50" />
              
              {/* Cutting Line (Only visible on web, helped for separation) */}
              {index < numVouchers - 1 && (
                <div className="absolute -bottom-8 left-0 w-full no-print flex items-center justify-center gap-2 text-gray-300">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-[10px] uppercase font-bold">รอยฉีก / CUT HERE</span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <p className="no-print mt-6 text-gray-400 text-sm italic">
          * กดปุ่ม "พิมพ์คูปอง" เพื่อดูตัวอย่างก่อนพิมพ์จริง
        </p>
      </div>
    </div>
  );
}
