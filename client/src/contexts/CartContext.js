/**
 * CartContext.js
 * 
 * This context manages the shopping cart state and operations for the MetalCut application.
 * It provides functionality for:
 * - Adding items to cart with unique IDs
 * - Removing items from cart
 * - Clearing the entire cart
 * - Reordering items from quote history
 * 
 * Each cart item contains:
 * - Unique ID (generated if not provided)
 * - Timestamp of when it was added
 * - Reference to original quote (if reordered)
 * - Item details (name, cost, material, etc.)
 */

import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext([]);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  /**
   * Adds an item to the cart with a unique ID and timestamp
   * @param {Object} item - The item to add to cart
   * @param {string} [item.id] - Optional unique ID, will be generated if not provided
   * @param {string} [item.quoteId] - Optional reference to original quote if reordering
   */
  const addItemToCart = (item) => {
    // Generate a unique ID if not provided
    const itemWithId = {
      ...item,
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
      quoteId: item.quoteId || null, // Reference to original quote if reordering
    };
    setCartItems((prevItems) => [...prevItems, itemWithId]);
  };

  /**
   * Removes an item from the cart by its ID
   * @param {string} itemId - The ID of the item to remove
   */
  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Creates a new cart item from a quote for reordering
   * @param {Object} quote - The quote to reorder
   * @param {string} quote.id - The quote ID
   * @param {string} quote.material - The material type
   * @param {string} quote.thickness - The material thickness
   * @param {number} quote.quantity - The quantity
   * @param {number} quote.totalCost - The total cost
   */
  const reorderFromQuote = (quote) => {
    // Create a new cart item from a quote
    const newItem = {
      id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: quote.material,
      size: quote.thickness,
      type: 'quote',
      cost: quote.totalCost,
      quoteId: quote.id,
      addedAt: new Date().toISOString(),
      quantity: quote.quantity,
      material: quote.material,
      thickness: quote.thickness,
    };
    addItemToCart(newItem);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addItemToCart, 
      removeItemFromCart, 
      clearCart,
      reorderFromQuote 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 