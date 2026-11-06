import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';
test('telas React dos cinco perfis renderizam sem erros e mantêm o conteúdo',async()=>{
 globalThis.location=new URL('http://localhost/teacher/dashboard');
 globalThis.window={fetch:async()=>{throw Error('offline');},localStorage:{getItem:()=>null,setItem(){}},addEventListener(){},removeEventListener(){}};
 globalThis.localStorage=window.localStorage;
 const server=await createServer({server:{middlewareMode:true,watch:null,hmr:false,ws:false},appType:'custom'});
 try{
 const context=await server.ssrLoadModule('/react-app/src/lib/context.tsx');await context.store.initialize();const db=context.store.getSnapshot().db;
 const modules={};for(const name of ['dashboard','activities','records','messages','screenings','training','reports','profiles'])modules[name]=await server.ssrLoadModule(`/react-app/src/pages/${name}.tsx`);
 const targets={teacher:[['dashboard','Dashboard'],['activities','Activities'],['activities','AdaptActivity'],['records','Classes'],['screenings','Screenings'],['messages','Messages'],['screenings','ScreeningForm']],student:[['dashboard','Dashboard'],['activities','Activities'],['records','Achievements'],['records','Sessions'],['messages','Messages']],psychologist:[['dashboard','Dashboard'],['records','Sessions'],['records','Students'],['messages','Messages']],psychopedagogue:[['dashboard','Dashboard'],['records','Students'],['records','Plans'],['training','Training'],['messages','Messages']],institution:[['dashboard','Dashboard'],['records','Students'],['records','Teachers'],['screenings','Screenings'],['reports','Reports']]};
 for(const [role,pages]of Object.entries(targets))for(const [module,name]of pages){
 const user=db.users.find(u=>u.role===role);const path=`/${role}/test/1`;globalThis.location=new URL(`http://localhost${path}`);
 const element=React.createElement(context.RoleContext.Provider,{value:{role,user,profile:{name:role}}},React.createElement(modules[module][name]));
 const html=renderToString(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(Routes,null,React.createElement(Route,{path:'/:role/test/:studentId',element}))));
 assert.ok(html.length>500,`${role}/${name}`);assert.doesNotMatch(html,/👋|demo-storage-warning|O backend PHP\/SQLite não está conectado/,`${role}/${name}`);
 }
 const profiles=renderToString(React.createElement(MemoryRouter,null,React.createElement(modules.profiles.Profiles)));
 for(const role of Object.keys(targets))assert.ok(profiles.includes(`/${role}/dashboard`));
 }finally{await server.close();}
});
