// Adapted from Manu Arora's MIT Sidebar, published on 21st.dev (Aceternity UI).
// https://21st.dev/@manuarora700/components/sidebar
// React Router, explicit collapse, keyboard focus, and Radix mobile dialog added.
import { createContext, useContext, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { cn } from '../../lib/utils';

type SidebarState = {
 open: boolean;
 setOpen: Dispatch<SetStateAction<boolean>>;
 mobileOpen: boolean;
 setMobileOpen: Dispatch<SetStateAction<boolean>>;
};
const SidebarContext = createContext<SidebarState | undefined>(undefined);
export function useSidebar() {
 const value = useContext(SidebarContext);
 if (!value) throw new Error('Sidebar components require a Sidebar provider');
 return value;
}
export function Sidebar({ children, open, setOpen, mobileOpen, setMobileOpen }: {
 children: ReactNode;
 open: boolean;
 setOpen: Dispatch<SetStateAction<boolean>>;
 mobileOpen: boolean;
 setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
 return <SidebarContext.Provider value={{open,setOpen,mobileOpen,setMobileOpen}}>{children}</SidebarContext.Provider>;
}
export function SidebarBody({ children }: { children: ReactNode }) {
 const {open,mobileOpen,setMobileOpen} = useSidebar();
 const reducedMotion = useReducedMotion();
 const expanded = open;
 return <>
  <motion.aside id="desktop-navigation" aria-label="Navegação lateral" className={cn('sidebar modern-sidebar desktop-sidebar',expanded ? 'is-expanded' : 'is-collapsed')}
   initial={false} animate={{width:expanded ? 244 : 72}} transition={{duration:reducedMotion ? 0 : .2,ease:'easeInOut'}}>
   {children}
  </motion.aside>
  <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
   <DialogContent className="sidebar modern-sidebar mobile-sidebar is-expanded">
    <DialogTitle className="sr-only">Menu principal</DialogTitle>
    <DialogDescription className="sr-only">Navegue pelas páginas do seu perfil.</DialogDescription>
    {children}
   </DialogContent>
  </Dialog>
 </>;
}
export function SidebarLink({ link, badge }: {link:{label:string;href:string;icon:ReactNode};badge?:string}) {
 const {open,setMobileOpen} = useSidebar();
 const reducedMotion = useReducedMotion();
 return <NavLink to={link.href} title={link.label} aria-label={link.label} onClick={()=>setMobileOpen(false)} className={({isActive})=>cn('nav-item',isActive && 'active')}>
  {link.icon}
  <motion.span className="sidebar-link-label" initial={false} animate={{opacity:open ? 1 : 0}} transition={{duration:reducedMotion ? 0 : .15}}>{link.label}</motion.span>
  {badge&&<span className="nav-new">{badge}</span>}
 </NavLink>;
}
