import React from 'react';

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Доставка та оплата</h1>
      
      <div className="space-y-12">
        <section className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>🚚</span> Доставка
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>Ми відправляємо замовлення по всій Україні за допомогою служби <span className="font-bold text-gray-900">Нова Пошта</span>.</p>
            <p>Термін відправки: до 3-х робочих днів з моменту підтвердження оплати.</p>
            <p>Вартість доставки оплачується покупцем згідно з тарифами перевізника.</p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>💳</span> Оплата
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Повна передоплата</h3>
              <p>Оплата на карту ПриватБанку. Це найшвидший спосіб отримати замовлення.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Накладений платіж</h3>
              <p>Оплата при отриманні у відділенні Нової Пошти. Для таких замовлень ми просимо обов&apos;язкову передоплату в розмірі <span className="font-bold text-gray-900">100 грн</span> для покриття витрат на доставку у разі відмови.</p>
            </div>
          </div>
        </section>

        <section className="bg-red-50 p-8 rounded-3xl border border-red-100">
          <h2 className="text-xl font-bold mb-4 text-red-600">ВАЖЛИВО</h2>
          <p className="text-red-700 leading-relaxed">
            Замовлення вважається підтвердженим лише після отримання оплати. Термін оплати замовлення — 24 години. Якщо оплата не надійшла протягом цього часу, замовлення автоматично скасовується.
          </p>
        </section>
      </div>
    </div>
  );
}
