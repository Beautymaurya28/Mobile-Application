import { useState } from 'react';
import RecordsPage from './pages/RecordsPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import VetsPage from './pages/VetsPage';
import { FileText, ShoppingBag, ShoppingCart, Stethoscope } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'records' | 'shop' | 'cart' | 'vets'>('records');

  const renderPage = () => {
    switch (currentPage) {
      case 'records':
        return <RecordsPage />;
      case 'shop':
        return <ShopPage />;
      case 'cart':
        return <CartPage />;
      case 'vets':
        return <VetsPage />;
      default:
        return <RecordsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">PetCare</h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('records')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'records'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} />
                <span className="hidden sm:inline">Records</span>
              </button>

              <button
                onClick={() => setCurrentPage('shop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'shop'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag size={20} />
                <span className="hidden sm:inline">Shop</span>
              </button>

              <button
                onClick={() => setCurrentPage('cart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'cart'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
              </button>

              <button
                onClick={() => setCurrentPage('vets')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'vets'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Stethoscope size={20} />
                <span className="hidden sm:inline">Vets</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
