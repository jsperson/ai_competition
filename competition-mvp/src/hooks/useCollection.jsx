import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

// Generic hook for managing collections (cart, favorites, selections, etc.)
export default function useCollection(collectionName) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(storage.getCollection(collectionName));
  }, [collectionName]);

  const addItem = (item) => {
    const existingItem = items.find(i => i.id === item.id);
    const newItems = existingItem
      ? items.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
      : [...items, { ...item, quantity: 1 }];

    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const removeItem = (itemId) => {
    const newItems = items.filter(i => i.id !== itemId);
    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const updateItem = (itemId, updates) => {
    const newItems = items.map(i => i.id === itemId ? { ...i, ...updates } : i);
    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const clearItems = () => {
    setItems([]);
    storage.remove(collectionName);
  };

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    itemCount: items.length
  };
}
