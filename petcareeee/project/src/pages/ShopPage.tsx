import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { ShoppingCart, Plus } from 'lucide-react';

const USER_ID = '00000000-0000-0000-0000-000000000001';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'food', name: 'Food' },
    { id: 'haircare', name: 'Hair Care' },
    { id: 'toys', name: 'Toys' },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    let query = supabase.from('products').select('*').order('name');

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const fetchCartCount = async () => {
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', USER_ID);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const addToCart = async (product: Product) => {
    setAddingToCart(product.id);

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert({
        user_id: USER_ID,
        product_id: product.id,
        quantity: 1,
      });
    }

    await fetchCartCount();
    setAddingToCart(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Pet Supply Shop</h1>
          <div className="relative">
            <ShoppingCart className="w-8 h-8 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">${product.price}</span>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingToCart === product.id || product.stock === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : addingToCart === product.id
                        ? 'bg-gray-400 text-white'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    <Plus size={18} />
                    {addingToCart === product.id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
