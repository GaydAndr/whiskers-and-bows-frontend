import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Про нас</h1>
      
      <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl">
            <img src="https://placehold.co/400" alt="Whiskers & Bows" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Ласкаво просимо до Whiskers & Bows</h2>
           <p className="text-gray-300 leading-relaxed mb-6">
             Whiskers & Bows — це бренд елітної амуніції, створений з глибокою повагою до котячої анатомії та потреб. Ми віримо, що кожен кіт заслуговує на аксесуари, які поєднують у собі бездоганний стиль, максимальний комфорт та високу міцність.
           </p>
           <p className="text-gray-300 leading-relaxed">
             Наша місія — перетворити щоденні прогулянки та носіння аксесуарів на задоволення як для ваших пухнастиків, так і для вас. Кожен виріб проходить ретельний контроль якості, щоб бути ідеальним у кожній деталі.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="text-3xl mb-4">🌿</div>
          <h3 className="font-bold mb-2 text-indigo-700">Еко-матеріали</h3>
           <p className="text-sm text-gray-400">Не використовуємо натуральну шкіру та шкідливий пластик.</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="text-3xl mb-4">🧵</div>
          <h3 className="font-bold mb-2 text-indigo-700">Ручна робота</h3>
           <p className="text-sm text-gray-400">Кожен виріб створюється індивідуально з увагою до деталей.</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl">
          <div className="text-3xl mb-4">❤️</div>
          <h3 className="font-bold mb-2 text-indigo-700">Любов до котів</h3>
           <p className="text-sm text-gray-400">Ми знаємо все про котячі замахи та потреби.</p>
        </div>
      </div>
    </div>
  );
}
