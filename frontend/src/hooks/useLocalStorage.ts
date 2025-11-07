import { useState } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (x: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (newValue: T): void => {
    try {
      // make sure work the same way as useState
      const valueToStore =
        newValue instanceof Function ? newValue(storedValue) : newValue;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}