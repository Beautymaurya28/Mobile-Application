import { useState, useEffect } from 'react';
import { supabase, CartItem, Product } from '../lib/supabase';
import { Trash2, Plus, Minus, CreditCard, CheckCircle } from 'lucide-react';

const USER_ID = '00000000-0000-0000-0000-000000000001';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<(CartItem & { products: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', USER_ID);

    if (!error && data) {
      setCartItems(data as (CartItem & { products: Product })[]);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    await fetchCartItems();
  };

  const removeItem = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    await fetchCartItems();
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.products?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const total = calculateTotal();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: USER_ID,
        total_amount: total,
        status: 'completed',
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (!orderError && order) {
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0,
      }));

      await supabase.from('order_items').insert(orderItems);

      await supabase.from('cart_items').delete().eq('user_id', USER_ID);

      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowCheckout(false);
        setCartItems([]);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
          <p className="text-gray-500 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-xl">Your cart is empty</p>
            <p className="text-gray-400 mt-2">Add some products to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex gap-4 items-center"
                >
                  <img
                    src={item.products?.image_url}
                    alt={item.products?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800">{item.products?.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.products?.category}</p>
                    <p className="text-xl font-bold text-blue-600 mt-2">
                      ${item.products?.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 transition"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <CreditCard size={24} />
                    Proceed to Checkout
                  </button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Details</h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      defaultValue="4111 1111 1111 1111"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue="12/25"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue="123"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      defaultValue="John Doe"
                    />

                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                      >
                        Pay ${calculateTotal().toFixed(2)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="px-4 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
