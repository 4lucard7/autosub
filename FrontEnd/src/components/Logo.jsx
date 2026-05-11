import React from 'react';
import { Activity } from 'lucide-react';

export default function Logo({ className = '', iconSize = 16, boxSize = 28 }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        style={{ width: boxSize, height: boxSize }}
        className="bg-black rounded-md flex items-center justify-center flex-shrink-0"
      >
        <Activity size={iconSize} className="text-white" />
      </div>
      <span className="font-bold text-gray-900 tracking-tight">AutoSub</span>
    </div>
  );
}
