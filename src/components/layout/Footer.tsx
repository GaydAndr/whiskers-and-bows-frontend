import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Info */}
        <div>
          <div className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-indigo-500">🐾</span> Whiskers & Bows
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Елітні аксесуари для котів, які знають собі ціну.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Навігація</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">Про нас</Link></li>
            <li><Link href="/cooperation" className="hover:text-white transition-colors">Співпраця</Link></li>
            <li><Link href="/contacts" className="hover:text-white transition-colors">Контакти</Link></li>
          </ul>
        </div>

        {/* Contacts & Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Контакти</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📞 +38 (0XX) XXX-XX-XX</li>
            <li>📧 hello@mrsnoopy.ua</li>
            <li>📍 м. Івано-Франківськ, вул. Чорновола</li>
            <li className="pt-2 border-t border-gray-800 mt-2">
              Графік: Пн-Пт 8:00-20:00, Сб-Нд вихідні
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Whiskers & Bows. Всі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
