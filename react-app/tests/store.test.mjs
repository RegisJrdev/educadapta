import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/lib/store.js';
import { createInitialData } from '../../src/demo/data.js';
const offline = async () => { throw new Error('offline'); };
const memory = initial => {let value=initial;return {getItem:()=>value,setItem:(_,v)=>{value=v;}};};
const teacher = {id:1,role:'teacher'};
test('React restaura os dados existentes e persiste novas alterações', async()=>{
 const db=createInitialData();db.students[0].xp=1200;
 const storage=memory(JSON.stringify(db)),store=createStore({storage,request:offline});await store.initialize();
 assert.equal(store.getSnapshot().db.students[0].xp,1200);
 await store.act('/teacher/messages',{receiver_id:2,content:'Mensagem no React'},teacher);
 const restored=createStore({storage,request:offline});assert.equal(restored.getSnapshot().db.messages.at(-1).content,'Mensagem no React');
});
test('React ignora dados locais inválidos sem quebrar a inicialização',async()=>{
 for(const value of ['{bad','{}',JSON.stringify({...createInitialData(),students:[]})]){
 const store=createStore({storage:memory(value),request:offline});await store.initialize();assert.ok(store.getSnapshot().db.students.length);assert.equal(store.getSnapshot().ready,true);
 }
});
test('ações inválidas não alteram o estado e conclusão repetida não duplica XP',async()=>{
 const store=createStore({storage:memory(),request:offline});await store.initialize();const before=store.getSnapshot().db;
 await assert.rejects(store.act('/teacher/adapt/confirm',{title:''},teacher));assert.equal(store.getSnapshot().db,before);
 const activity=before.adapted.find(a=>a.student_id===1&&!a.completed_by_student),xp=before.students[0].xp;
 await Promise.all([store.act(`/student/activities/${activity.id}/complete`,{}, {id:2,role:'student'}),store.act(`/student/activities/${activity.id}/complete`,{}, {id:2,role:'student'})]);
 assert.equal(store.getSnapshot().db.students[0].xp,xp+activity.xp_earned);
});
test('React reaplica ação após conflito sem perder a alteração remota',async()=>{
 let saved={state:createInitialData(),revision:2},conflict=true;
 const request=async(_,options={})=>{
 if(!options.method)return Response.json(saved);
 const candidate=JSON.parse(options.body);
 if(conflict){conflict=false;saved.state.messages.push({id:200,sender_id:1,receiver_id:2,content:'Outra aba',created_at:new Date().toISOString()});saved.revision++;return Response.json(saved,{status:409});}
 assert.equal(candidate.revision,saved.revision);saved={state:candidate.state,revision:saved.revision+1};return Response.json(saved);
 };
 const store=createStore({storage:memory(),request});await store.initialize();await store.act('/teacher/messages',{receiver_id:2,content:'Nova interface'},teacher);
 assert.equal(saved.state.messages.filter(m=>m.content==='Outra aba').length,1);assert.equal(saved.state.messages.filter(m=>m.content==='Nova interface').length,1);
});
test('falha de gravação remota mantém o último estado confirmado',async()=>{
 const remote=createInitialData();const store=createStore({storage:memory(),request:async(_,o={})=>o.method?Response.json({message:'Falha',revision:4},{status:500}):Response.json({state:remote,revision:4})});
 await store.initialize();const count=store.getSnapshot().db.messages.length;
 await assert.rejects(store.act('/teacher/messages',{receiver_id:2,content:'Não gravada'},teacher));assert.equal(store.getSnapshot().db.messages.length,count);assert.equal(store.getSnapshot().backend,true);
});
test('armazenamento bloqueado mantém a ação na sessão e informa o usuário',async()=>{
 const store=createStore({storage:{getItem(){throw Error();},setItem(){throw Error();}},request:offline});await store.initialize();await store.act('/teacher/messages',{receiver_id:2,content:'Sessão'},teacher);assert.equal(store.getSnapshot().db.messages.at(-1).content,'Sessão');assert.match(store.getSnapshot().notice,/sessão/);
});
