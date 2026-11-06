import { createContext, useContext, useSyncExternalStore } from 'react';
import { createStore } from './store';
let storage;
try { storage = window.localStorage; } catch { /* Storage opcional. */ }
export const store = createStore({ storage, request: window.fetch.bind(window) });
export function useStore(): any { return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot); }
export const RoleContext = createContext<any>(null);
export const useRole = () => useContext(RoleContext);
export const date = (value: string, withTime = false) => {
 const parsed = new Date(value);
 return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
};
