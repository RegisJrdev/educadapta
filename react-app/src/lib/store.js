import { createInitialData } from '../../../src/demo/data.js';
import { applyAction } from '../../../src/demo/actions.js';
import { isDemoState } from '../../../src/demo/validation.js';
const key = 'educadapta-demo-v1';
export function createStore({ storage, request } = {}) {
 let db;
 try { const saved = JSON.parse(storage?.getItem(key)); db = isDemoState(saved) ? saved : createInitialData(); } catch { db = createInitialData(); }
 let snapshot = { db, ready: false, backend: false, notice: '' }, revision = 0, queue = Promise.resolve(), initialization;
 const listeners = new Set();
 const publish = patch => { snapshot = { ...snapshot, ...patch }; listeners.forEach(fn => fn()); };
 const read = async () => {
  const response = await request('/api/state', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Não foi possível carregar os dados.');
  const body = await response.json();
  if (!Number.isSafeInteger(body.revision) || body.revision < 0 || (body.state !== null && !isDemoState(body.state))) throw new Error('Dados inválidos recebidos da API.');
  revision = body.revision; return body.state;
 };
 const write = async state => {
  const response = await request('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ state, revision }) });
  const body = await response.json();
  if (!Number.isSafeInteger(body.revision) || body.revision < 0) throw new Error('Resposta inválida ao salvar.');
  if (response.status === 409) {
   if (body.state !== null && !isDemoState(body.state)) throw new Error('Dados de atualização inválidos.');
   revision = body.revision; return { conflict: true, state: body.state };
  }
  if (!response.ok) throw new Error(body.message || 'Não foi possível salvar. Tente novamente.');
  revision = body.revision; return { conflict: false };
 };
 return {
  getSnapshot: () => snapshot,
  subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
  clearNotice: () => publish({ notice: '' }),
  initialize() {
   if (initialization) return initialization;
   initialization = (async () => {
    try {
     let remote = await read();
     if (!remote) { const saved = await write(snapshot.db); if (saved.conflict) remote = saved.state || await read(); }
     publish({ db: remote || snapshot.db, backend: true });
    } catch { /* A demonstração também funciona com dados locais. */ }
    finally { publish({ ready: true }); }
   })();
   return initialization;
  },
  act(path, data, user) {
   const operation = async () => {
    await this.initialize();
    const before = snapshot.db;
    let candidate = structuredClone(before);
    let result = applyAction(candidate, path, data, user);
    if (snapshot.backend) {
     try {
      let saved = await write(candidate);
      if (saved.conflict) {
       const latest = saved.state || await read();
       if (!latest) throw new Error('Os dados mudaram. Atualize a página e tente novamente.');
       publish({ db: latest });
       candidate = structuredClone(latest);
       result = applyAction(candidate, path, data, user);
       saved = await write(candidate);
       if (saved.conflict) { if (saved.state) publish({ db: saved.state }); throw new Error('Outra pessoa atualizou os dados. Tente novamente.'); }
      }
     } catch (error) {
      try { const remote = await read(); if (remote) publish({ db: remote }); } catch { /* Preserva o último estado confirmado. */ }
      throw error;
     }
    } else {
     try { storage?.setItem(key, JSON.stringify(candidate)); }
     catch { publish({ db: candidate, notice: 'Alteração mantida nesta sessão. O navegador bloqueou o armazenamento.' }); return result; }
    }
    publish({ db: candidate, notice: result.message }); return result;
   };
   const pending = queue.then(operation); queue = pending.catch(() => {}); return pending;
  },
 };
}
