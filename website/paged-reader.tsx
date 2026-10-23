"use client";

import {useEffect,useLayoutEffect,useRef,useState,type CSSProperties,type FocusEvent,type KeyboardEvent,type ReactNode} from "react";
import PaperStack from "./paper-stack";

type View='auto'|'single'|'spread';

export default function PagedReader({id,label,children,className='',initialTarget}:{id:string;label:string;children:ReactNode;className?:string;initialTarget?:string}){
 const root=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),viewport=useRef<HTMLDivElement>(null),flow=useRef<HTMLDivElement>(null);
 const [width,setWidth]=useState(760),[wide,setWide]=useState(false),[view,setView]=useState<View>('auto');
 const [screenHeight,setScreenHeight]=useState(844),[fitted,setFitted]=useState(false);
 const [page,setPage]=useState(0),[count,setCount]=useState(1),[extent,setExtent]=useState(1);
 const pageRef=useRef(0),stride=useRef(1),countRef=useRef(1);
 const pointing=useRef(false);
 const pendingTarget=useRef(initialTarget);
 const columns=view==='spread'||(view==='auto'&&wide)?2:1;
 const chapter=className.includes('chapter-reader');
 const fitInset=wide?24:96;
 const availableHeight=Math.max(80,screenHeight-fitInset-96);
 const paperWidth=columns===2?Math.max(width,760):Math.min(width,600);
 const paperHeight=Math.round(chapter&&columns===1?Math.max(620,Math.min(820,screenHeight-180)):Math.max(460,Math.min(780,paperWidth/columns*1.42)));
 const scale=Math.min(1,width/paperWidth,fitted?availableHeight/paperHeight:1);

 useEffect(()=>{
  const media=window.matchMedia('(min-width: 900px)');
  const update=()=>setWide(media.matches);update();media.addEventListener('change',update);
  const observer=new ResizeObserver(([entry])=>setWidth(Math.max(200,Math.floor(entry.contentRect.width))));
  if(root.current)observer.observe(root.current);
  // Pinch zoom magnifies the existing pages; it must not shrink or repaginate them.
  const sizeScreen=()=>{
   const visual=window.visualViewport;
   if(visual&&Math.abs(visual.scale-1)>.01)return;
   setScreenHeight(Math.round(visual?.height||window.innerHeight));
  };
  setScreenHeight(Math.round(window.innerHeight));
  sizeScreen();window.addEventListener('resize',sizeScreen);window.visualViewport?.addEventListener('resize',sizeScreen);
  return()=>{media.removeEventListener('change',update);observer.disconnect();window.removeEventListener('resize',sizeScreen);window.visualViewport?.removeEventListener('resize',sizeScreen);};
 },[]);

 useEffect(()=>{
  if(!fitted||Math.abs((window.visualViewport?.scale||1)-1)>.01||document.activeElement?.matches('input,textarea,select'))return;
  let inner=0;const outer=requestAnimationFrame(()=>{inner=requestAnimationFrame(()=>stage.current?.scrollIntoView({block:'start',behavior:'instant'}));});
  return()=>{cancelAnimationFrame(outer);cancelAnimationFrame(inner);};
 },[fitted,screenHeight,width,columns]);

 // A new chapter starts at page one; the reader's view and fit choices stay put.
 useLayoutEffect(()=>{pageRef.current=0;pointing.current=false;},[id,label]);

 useLayoutEffect(()=>{
  const el=viewport.current,content=flow.current;if(!el||!content)return;
  let active=true,frame=0;
  function measure(){
   if(!active||!el||!content)return;
   const gap=parseFloat(getComputedStyle(content).columnGap)||0;
   stride.current=(el.clientWidth+gap)/columns;
   const total=Math.max(columns,Math.ceil((content.scrollWidth+gap-2)/stride.current));
   countRef.current=total;setCount(total);setExtent(Math.ceil(total/columns)*columns*stride.current-gap);
   let requested=pageRef.current;
   if(pendingTarget.current&&el.clientWidth>0&&el.clientHeight>0){
    const target=document.getElementById(pendingTarget.current);
    if(target&&content.contains(target)){
     const rect=target.getClientRects()[0],bounds=el.getBoundingClientRect();
     const zoom=bounds.width/el.clientWidth||1;
     if(rect){requested=Math.floor(Math.max(0,(rect.left-bounds.left)/zoom+el.scrollLeft+3)/stride.current);pendingTarget.current=undefined;}
    }
   }
   const last=Math.max(0,Math.ceil(total/columns)*columns-columns);
   const current=Math.min(Math.floor(requested/columns)*columns,last);
   pageRef.current=current;setPage(current);el.scrollTo({left:current*stride.current,behavior:'instant'});
  }
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const resize=new ResizeObserver(schedule);resize.observe(el);
  const mutation=new MutationObserver(schedule);mutation.observe(content,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['open','style']});
  measure();void document.fonts.ready.then(schedule);
  return()=>{active=false;cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();};
 },[id,label,columns,paperWidth,paperHeight]);

 function go(index:number){
  const last=Math.max(0,Math.ceil(countRef.current/columns)*columns-columns);
  const next=Math.max(0,Math.min(index,last));pageRef.current=next;setPage(next);
  viewport.current?.scrollTo({left:next*stride.current,behavior:'instant'});
 }
 function syncScroll(){
  const column=Math.max(0,Math.min(Math.round((viewport.current?.scrollLeft||0)/stride.current),countRef.current-1));
  const next=Math.floor(column/columns)*columns;
  pageRef.current=next;setPage(next);
 }
 function revealFocus(event:FocusEvent<HTMLDivElement>){
  const target=event.target as HTMLElement;
  requestAnimationFrame(()=>{
   const el=viewport.current;if(!el||pointing.current||target===el||!target.isConnected)return;
   const rect=target.getClientRects()[0];if(!rect)return;
   const x=(rect.left-el.getBoundingClientRect().left)/scale+el.scrollLeft;
   go(Math.floor(Math.max(0,x+3)/stride.current/columns)*columns);
  });
 }
 function keyboard(event:KeyboardEvent){
  const target=event.target as HTMLElement;
  if(target.matches('input,textarea,select')||target.isContentEditable)return;
  if(event.key==='ArrowRight'){event.preventDefault();go(pageRef.current+columns);}
  if(event.key==='ArrowLeft'){event.preventDefault();go(pageRef.current-columns);}
 }
 const range=columns===1?`${page+1}`:`${page+1}–${Math.min(page+columns,count)}`;
 const last=page+columns>=count;
 const pagination=(bottom=false)=><div className={`reader-pagination ${bottom?'reader-pagination-bottom':''}`} aria-label={`${label} page controls${bottom?' below the pages':''}`}><button disabled={page===0} aria-label={`Previous page in ${label}${bottom?' below':''}`} onClick={()=>go(page-columns)}>← <span>Previous</span></button><label><span className="sr-only">{bottom?'Go to page below':'Go to page'} in {label}</span><select aria-label={`${bottom?'Go to page below':'Go to page'} in ${label}`} value={Math.floor(page/columns)*columns} onChange={e=>go(Number(e.target.value))}>{Array.from({length:Math.ceil(count/columns)},(_,i)=>i*columns).map(p=><option key={p} value={p}>{columns===1||p+1===count?`Page ${p+1}`:`Pages ${p+1}–${Math.min(p+columns,count)}`} of {count}</option>)}</select></label><button disabled={last} aria-label={`Next page in ${label}${bottom?' below':''}`} onClick={()=>go(page+columns)}><span>Next</span> →</button></div>;
 return <section ref={root} id={id} className={`paged-reader ${className}`} aria-label={`${label} e-reader`} tabIndex={-1} data-columns={columns} data-fitted={fitted} style={{'--fit-inset':`${fitInset}px`} as CSSProperties} onKeyDown={keyboard}>
  <div className="reader-toolbar"><span className="reader-label">{label}</span><div className="reader-view" role="group" aria-label={`View ${label}`}><button aria-pressed={columns===1} onClick={()=>setView('single')}>Single page</button><button aria-pressed={columns===2} onClick={()=>setView('spread')}>Book spread</button><button className="reader-fit" aria-pressed={fitted} onClick={()=>{if(!fitted)setView('single');setFitted(!fitted);}}>{fitted?'Fit width':'Fit to screen'}</button></div>{pagination()}</div>
  <div ref={stage} className="reader-stage" style={{width:paperWidth*scale,height:paperHeight*scale}}>
   <div className="reader-paper" style={{width:paperWidth,height:paperHeight,transform:`scale(${scale})`,'--reader-columns':columns} as CSSProperties}>
    <PaperStack width={paperWidth-(columns===2?2:6)} height={paperHeight-2} spread={columns===2}/>
    <div className="reader-paper-surface">
    <div className="reader-paper-wear" aria-hidden="true"><span className="paper-patina"/><span className="paper-coffee-stain"/><span className="paper-burn-mark"/><span className="paper-crease"/><span className="paper-fold"/></div>
    <div className="reader-running-head" aria-hidden="true">{Array.from({length:columns},(_,i)=><span key={i}>Dream AI Library Roleplay <em>{label}</em></span>)}</div>
    <div ref={viewport} className="reader-viewport" onScroll={syncScroll} onFocusCapture={revealFocus} onPointerDownCapture={()=>{pointing.current=true;}} onPointerUpCapture={()=>{pointing.current=false;}} onPointerCancel={()=>{pointing.current=false;}} tabIndex={0} aria-label={`Read ${label}; use the page controls or left and right arrow keys`}><div ref={flow} className="reader-flow">{children}</div><span className="reader-scroll-end" style={{left:Math.max(0,extent-1)}} aria-hidden="true"/></div>
    <div className="reader-folios" aria-hidden="true">{Array.from({length:columns},(_,i)=><span key={i}><small>StormDragonStudios</small><b>{page+i<count?String(page+i+1).padStart(2,'0'):'❦'}</b></span>)}</div>
    </div>
   </div>
  </div>
  <span className="sr-only" role="status" aria-live="polite">{label}: {columns===1?'page':'pages'} {range} of {count}</span>
  {pagination(true)}
 </section>;
}
