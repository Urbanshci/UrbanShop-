

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Plus, Minus, X, Send } from 'lucide-react';

const ChocApp = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Chocolat Noir Intense',
      price: 5.99,
      description: 'Chocolat noir 70% cacao aux notes intenses et fruitées',
      image: '/image/montre.jpeg',
      bestseller: true
    },
    {
      id: 2,
      name: 'Chocolat au Lait Crémeux',
      price: 4.99,
      description: 'Notre chocolat au lait signature, doux et onctueux',
      image: '/api/placeholder/200/150',
      favorite: true
    },
    {
      id: 3,
      name: 'Pralines Assorties',
      price: 8.99,
      description: 'Sélection de nos meilleures pralines artisanales',
      image: '/api/placeholder/200/150',
      new: true
    }
  ]);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const whatsappNumber = "2250171006141";

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
   
    // Afficher la notification
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    const message = encodeURIComponent(
      `Bonjour! 🍫\n\n` +
      `Je souhaite commander chez Choc :\n\n` +
      cart.map(item =>
        `${item.quantity}x ${item.name}\n` +
        `Prix unitaire : ${item.price}€\n` +
        `Sous-total : ${(item.price * item.quantity).toFixed(2)}€\n`
      ).join('\n') +
      `\nTotal : ${getTotalPrice().toFixed(2)}€\n\n` +
      `Merci de confirmer la disponibilité! 😊`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  // Composant de notification
  const AddedNotification = () => (
    <div className={`fixed bottom-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg
                    transform transition-all duration-300 ${showAddedNotification ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      Produit ajouté au panier! 🍫
    </div>
  );

  // Composant du panier flottant
  const FloatingCart = () => (
    <>
      {/* Bouton du panier flottant */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-amber-600 hover:bg-amber-700 text-white
                   rounded-full p-4 shadow-lg transform transition-all duration-300
                   hover:scale-110 flex items-center space-x-2 z-50"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <>
            <span className="text-lg font-bold">
              {getTotalPrice().toFixed(2)}€
            </span>
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center
                           justify-center text-sm absolute -top-2 -right-2">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </>
        )}
      </button>

      {/* Panel du panier */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white rounded-t-xl
                        shadow-xl transform transition-transform duration-300">
            <div className="p-4 bg-gradient-to-r from-brown-600 to-amber-800 text-white
                          rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Votre Panier</h2>
              <button onClick={() => setIsCartOpen(false)}
                      className="p-1 hover:bg-amber-700 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
           
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Votre panier est vide</p>
              ) : (
                cart.map(item => (
                  <div key={item.id}
                       className="flex items-center space-x-4 bg-amber-50 rounded-lg p-3 mb-3">
                 
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-amber-200 rounded hover:bg-amber-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-amber-200 rounded hover:bg-amber-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-bold text-amber-600">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
           
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    {getTotalPrice().toFixed(2)}€
                  </span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700
                           hover:from-amber-700 hover:to-amber-800 text-white py-4
                           rounded-lg text-lg font-bold"
                  onClick={handleCheckout}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Commander via WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-brown-600 to-amber-800 text-white py-8 px-4 mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            🍫 Choc
          </h1>
          <p className="text-xl text-amber-100">
            Découvrez nos délicieux chocolats artisanaux
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id}
                  className="transform transition-all duration-300 hover:scale-105
                           hover:shadow-xl bg-white rounded-xl overflow-hidden">
              <CardHeader className="relative p-0">
        
                {product.bestseller && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black
                               px-3 py-1 rounded-full flex items-center">
                    <Star className="w-4 h-4 mr-1" /> Bestseller
                  </div>
                )}
                {product.favorite && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white
                               px-3 py-1 rounded-full flex items-center">
                    <Heart className="w-4 h-4 mr-1" /> Coup de cœur
                  </div>
                )}
                {product.new && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white
                               px-3 py-1 rounded-full">
                    Nouveau !
                  </div>
                )}
              </CardHeader>
             
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-bold text-brown-800 mb-2">
                  {product.name}
                </CardTitle>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-amber-600">
                  {product.price.toFixed(2)} €
                </p>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700
                           hover:from-amber-700 hover:to-amber-800 text-white font-bold
                           py-3 rounded-lg transform transition-all duration-300
                           hover:scale-105"
                  onClick={() => addToCart(product)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Pied de page */}
      <footer className="mt-16 bg-brown-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-amber-100">
            Contactez-nous pour des commandes personnalisées !
          </p>
        </div>
      </footer>

      {/* Panier flottant */}
      <FloatingCart />
     
      {/* Notification */}
      <AddedNotification />
    </div>
  );
};

export default ChocApp;