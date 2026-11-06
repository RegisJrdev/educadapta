import React, { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Layout, menus } from './components/layout';
import { Button } from './components/shared';
import { store } from './lib/context';
import { Dashboard } from './pages/dashboard';
import { Profiles } from './pages/profiles';
import { Activities, AdaptActivity } from './pages/activities';
import { Achievements, Classes, Plans, Sessions, Students, Teachers } from './pages/records';
import { Screenings, ScreeningForm } from './pages/screenings';
import { Messages } from './pages/messages';
import { Training } from './pages/training';
import { Reports } from './pages/reports';
import './index.css';
class ErrorBoundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return{error:true};}render(){return this.state.error?<div className="not-found"><h1>Não foi possível abrir esta tela</h1><p>Atualize a página para tentar novamente.</p><Button onClick={()=>location.reload()}>Atualizar página</Button></div>:this.props.children;}}
function RolePage({page,children}:any){const{role}=useParams();return menus[role||'']?.some((item:any)=>item[0]===page)?children:<NotFound/>;}
function NotFound(){return <div className="not-found"><h1>Este caminho ainda não existe.</h1><p>Escolha um perfil para voltar à sua jornada.</p><Button onClick={()=>location.assign('/demo')}>Voltar aos perfis</Button></div>;}
function RoutedPage({page,children}:any){return <RolePage page={page}>{children}</RolePage>;}
try { document.documentElement.classList.toggle('dark', localStorage.getItem('educadapta-theme') !== 'light'); } catch { document.documentElement.classList.add('dark'); }
store.initialize();
createRoot(document.getElementById('app')!).render(<React.StrictMode><ErrorBoundary><BrowserRouter><Routes><Route path="/" element={<Profiles/>}/>{['/demo','/login','/register'].map(path=><Route key={path} path={path} element={<Profiles/>}/>)}<Route path="/:role" element={<Layout/>}><Route index element={<Navigate to="dashboard" replace/>}/>{Object.entries({dashboard:<Dashboard/>,activities:<Activities/>,adapt:<AdaptActivity/>,classes:<Classes/>,students:<Students/>,teachers:<Teachers/>,sessions:<Sessions/>,schedule:<Sessions/>,plans:<Plans/>,achievements:<Achievements/>,screenings:<Screenings/>,messages:<Messages/>,'train-ai':<Training/>,reports:<Reports/>}).map(([path,element])=><Route key={path} path={path} element={<RoutedPage page={path}>{element}</RoutedPage>}/>)}<Route path="screenings/create/:studentId" element={<RolePage page="adapt"><ScreeningForm/></RolePage>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></ErrorBoundary></React.StrictMode>);
