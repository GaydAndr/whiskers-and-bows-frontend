"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  defaultValue?: string;
}

export default function SortSelect({ defaultValue }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        className="w-full p-3 bg-black text-white border-2 border-white rounded-xl text-sm font-medium appearance-none cursor-pointer hover:bg-gray-900 transition-colors outline-none"
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        <option value="" className="text-gray-900 bg-white">За замовчуванням</option>
        <option value="price_asc" className="text-gray-900 bg-white">Від дешевих до дорогих</option>
        <option value="price_desc" className="text-gray-900 bg-white">Від дорогих до дешевих</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
