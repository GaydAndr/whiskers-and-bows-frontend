import React from 'react';

export default function CooperationPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Співпраця</h1>
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm mb-12">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 uppercase tracking-wide">Станьте нашим партнером</h2>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Ми завжди відкриті до співпраці з зоомагазинами, ветеринарними клініками та блогерами, які поділяють нашу любов до котів та прагнуть надавати їм найкраще.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold mb-2 text-indigo-800 text-lg">Для магазинів</h3>
            <p className="text-sm text-gray-600">Спеціальні оптові ціни та підтримка в розміщенні товарів.</p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold mb-2 text-indigo-800 text-lg">Для блогерів</h3>
            <p className="text-sm text-gray-600">Тестування новинок та взаємовигідний PR.</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Зацікавлені? Напишіть нам на <span className="text-indigo-600 font-medium">hello@whiskersbows.ua</span></p>
        </div>
      </div>
    </div>
  );
}
