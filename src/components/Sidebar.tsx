'use client';

import Link from './NavigationLink';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n, type DictKey } from '@/lib/i18n';
import { localePath } from '@/lib/seo';
import AccountControls from './AccountControls';

type IconName = 'home'|'practice'|'exam'|'book'|'training'|'tools'|'user'|'membership'|'language'|'menu'|'close';
const paths:Record<IconName,ReactNode>={
  home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>,
  practice:<><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 9 1 1 2-2m-3 7 1 1 2-2m3-5h3m-3 6h3"/></>,
  exam:<><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M9 3h6v4H9zm-1 9h8m-8 4h5"/></>,
  book:<><path d="M12 5v16m0-16C8 2 3 4 3 4v15s5-2 9 2c4-4 9-2 9-2V4s-5-2-9 1Z"/></>,
  training:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  tools:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><path d="M14 17.5h7m-3.5-3.5v7"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  membership:<><path d="m3 7 4 4 5-7 5 7 4-4-2 12H5Z"/><path d="M8 22h8"/></>,
  language:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a17 17 0 0 1 0 18 17 17 0 0 1 0-18Z"/></>,
  menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
  close:<path d="m6 6 12 12M6 18 18 6"/>,
};
function Icon({name}:{name:IconName}){return <svg aria-hidden="true" className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;}
function Brand(){return <><span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-indigo-600 text-white shadow-[0_2px_5px_#4f46e526]"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5m8-14-6 7 6 7m-6-7h7"/></svg></span><span className="text-[19px] font-semibold tracking-[-0.6px] text-slate-900">CK<span className="ml-1 font-normal text-slate-500">Quiz</span></span></>;}

type Item={path:string;label:DictKey;icon?:IconName};
const training:Item[]=[{path:'/memory',label:'navMemory'},{path:'/grid',label:'navGrid'},{path:'/peak',label:'navPeak'}];
const tools:Item[]=[{path:'/pipeline',label:'navPipeline'},{path:'/numerical',label:'navNumerical'},{path:'/series',label:'navSeries'}];
type NavigationGroup={icon:'tools'|'training';zh:string;en:string;items:Item[]};
const navigation:(Item|NavigationGroup)[]=[
  {path:'',label:'navHome',icon:'home'},
  {icon:'tools',zh:'解题工具',en:'Solving tools',items:tools},
  {icon:'training',zh:'专项训练',en:'Skill training',items:training},
  {path:'/practice',label:'navPractice',icon:'practice'},
  {path:'/exams',label:'navExams',icon:'exam'},
  {path:'/guides',label:'navGuides',icon:'book'},
];
const row='group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500';
const selected='bg-white font-semibold text-indigo-700 shadow-[0_1px_4px_#0f172a0b] ring-1 ring-slate-200/80';
const neutral='font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-950';

function NavGroup({label,icon,items,pathname,close}:{label:string;icon:IconName;items:Item[];pathname:string;close:()=>void}){
  const {lang,t}=useI18n();
  const current=items.some(item=>pathname===localePath(lang,item.path));
  const [open,setOpen]=useState(current);
  const id=`navigation-${icon}`;
  return <div>
    <button type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)} className={`${row} ${current?'font-semibold text-indigo-700 hover:bg-indigo-50':neutral}`}><Icon name={icon}/><span className="flex-1 text-left">{label}</span><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={`size-4 text-slate-400 transition-transform motion-reduce:transition-none ${open?'rotate-90':''}`}><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
    <div id={id} hidden={!open} className="ml-[21px] mt-1 border-l border-slate-200 pl-3"><div className="space-y-1 py-1">{items.map(item=>{const target=localePath(lang,item.path),active=pathname===target;return <Link key={item.path} href={target} onClick={close} aria-current={active?'page':undefined} className={`${row} !min-h-9 !gap-2.5 ${active?'bg-indigo-50 font-semibold text-indigo-700':'text-slate-500 hover:bg-slate-200/40 hover:text-slate-900'}`}><span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${active?'bg-indigo-500':'bg-slate-300'}`}/><span>{t(item.label)}</span></Link>;})}</div></div>
  </div>;
}

export default function Sidebar(){
  const pathname=usePathname();
  const {lang,t,toggle}=useI18n(),zh=lang==='zh';
  const [mobileOpen,setMobileOpen]=useState(false);
  const sidebar=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null);
  const close=()=>setMobileOpen(false);
  useEffect(()=>{
    if(!mobileOpen)return;
    const opener=trigger.current;
    const main=document.querySelector('main');
    const overflow=document.body.style.overflow;
    if(main)main.inert=true;
    document.body.style.overflow='hidden';
    closeButton.current?.focus();
    function keyboard(event:KeyboardEvent){
      // Clerk's profile/sign-in dialogs own their own keyboard handling.
      if(!sidebar.current?.contains(document.activeElement))return;
      if(event.key==='Escape'){event.preventDefault();setMobileOpen(false);}
      if(event.key!=='Tab')return;
      const elements=Array.from(sidebar.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')).filter(el=>el.getClientRects().length);
      const first=elements[0],last=elements.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
    const media=window.matchMedia('(min-width: 768px)');
    const resize=()=>{if(media.matches)setMobileOpen(false);};
    media.addEventListener('change',resize);document.addEventListener('keydown',keyboard);
    return ()=>{if(main)main.inert=false;document.body.style.overflow=overflow;document.removeEventListener('keydown',keyboard);media.removeEventListener('change',resize);opener?.focus();};
  },[mobileOpen]);
  function accountLink(path:string,label:string,icon:IconName){return <Link href={path} onClick={close} aria-current={pathname===path?'page':undefined} className={`${row} ${pathname===path?selected:neutral}`}><Icon name={icon}/><span>{label}</span></Link>;}
  return <>
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-sm md:hidden"><Link href={localePath(lang)} className="flex items-center gap-2.5" aria-label={zh?'CK Quiz 首页':'CK Quiz home'}><Brand/></Link><button ref={trigger} type="button" aria-label={zh?'打开导航菜单':'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="app-sidebar" onClick={()=>setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2.5 text-slate-600"><Icon name="menu"/></button></header>
    {mobileOpen&&<div className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] md:hidden" onClick={close} aria-hidden="true"/>}
    <aside id="app-sidebar" ref={sidebar} role={mobileOpen?'dialog':undefined} aria-modal={mobileOpen?true:undefined} aria-label={zh?'工作台导航':'Workspace navigation'} className={`${mobileOpen?'flex':'hidden'} fixed inset-y-0 left-0 z-40 h-dvh w-[272px] shrink-0 flex-col border-r border-slate-200/80 bg-[#f7f8fb] md:sticky md:top-0 md:z-10 md:flex md:w-[248px] lg:w-[264px]`}>
      <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-6"><Link href={localePath(lang)} onClick={close} className="flex items-center gap-3" aria-label={zh?'CK Quiz 首页':'CK Quiz home'}><Brand/></Link><button type="button" ref={closeButton} onClick={close} aria-label={zh?'关闭导航菜单':'Close navigation menu'} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 md:hidden"><Icon name="close"/></button></div>
      <div className="mb-6 shrink-0 px-6"><span className="text-[11px] text-slate-400">{zh?'测评备考工作台':'Assessment workspace'}</span></div>
      <nav aria-label={zh?'学习与练习':'Study and practice'} className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-slate-400">{zh?'备考空间':'PREPARATION'}</p><div className="space-y-1">{navigation.map(item=>{if('items' in item)return <NavGroup key={`${item.icon}:${pathname}`} label={zh?item.zh:item.en} icon={item.icon} items={item.items} pathname={pathname} close={close}/>;const target=localePath(lang,item.path),active=pathname===target||(item.path!==''&&pathname.startsWith(target+'/'));return <Link key={item.path} href={target} onClick={close} aria-current={active?'page':undefined} className={`${row} ${active?selected:neutral}`}><Icon name={item.icon!}/><span className="flex-1">{t(item.label)}</span>{item.path==='/exams'&&<span className={`rounded border px-1.5 py-px text-[9px] font-semibold tracking-wide ${active?'border-indigo-200 text-indigo-500':'border-slate-200 text-slate-400'}`}>PRO</span>}{active&&<span className="h-4 w-0.5 rounded bg-indigo-500" aria-hidden="true"/>}</Link>;})}</div>
      </nav>
      <div className="shrink-0 border-t border-slate-200/80 px-4 pb-4 pt-4">
        <nav aria-label={zh?'账号与订阅':'Account and membership'} className="space-y-1"><p className="px-3 pb-1 text-[10px] font-semibold tracking-[0.12em] text-slate-400">{zh?'账号与会员':'ACCOUNT'}</p>{accountLink('/account',zh?'我的账号':'My account','user')}{accountLink('/billing',zh?'会员与价格':'Membership & pricing','membership')}</nav>
        <div className="mx-2 mb-3 mt-4 border-t border-slate-200/80"/><AccountControls onNavigate={close}/>
        <div className="mt-3 flex items-center justify-between px-3"><span className="text-[10px] tracking-wide text-slate-400">CKAutoFlow</span><button type="button" onClick={()=>{close();toggle();}} aria-label={zh?'切换为 English':'Switch to 中文'} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"><Icon name="language"/><span>{zh?'EN':'中文'}</span></button></div>
      </div>
    </aside>
  </>;
}
