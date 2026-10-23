import {memo,type CSSProperties} from "react";

const number=(value:number)=>value.toFixed(2);

// Each leaf is a closed contour: the fore-edge turns into the bottom edge.
function leaf(width:number,height:number,depth:number,spread:boolean,seed:number){
 const left=spread?-depth*.55:1,right=width+depth*.55,top=2+depth*.06,bottom=height+depth,radius=5;
 const lower=(x:number)=>bottom-(spread?depth*.52*Math.exp(-Math.pow((x-width/2)/(width*.075),2)):0);
 const path=[`M${number(left+radius)} ${number(top)}H${number(right-radius)}Q${number(right)} ${number(top)} ${number(right)} ${number(top+radius)}`];
 for(let y=top+radius+4;y<bottom-radius-3;y+=7){
  const rough=.26*Math.sin(y*1.79+seed*2.3)+.2*Math.sin(y*.31+seed);
  path.push(`L${number(right+rough)} ${number(y)}`);
 }
 path.push(`L${number(right)} ${number(bottom-radius)}Q${number(right)} ${number(bottom)} ${number(right-radius)} ${number(bottom)}`);
 for(let x=right-radius-3;x>left+radius+3;x-=7){
  const rough=.27*Math.sin(x*1.63+seed*1.7)+.17*Math.sin(x*.29+seed);
  path.push(`L${number(x)} ${number(lower(x)+rough)}`);
 }
 path.push(`L${number(left+radius)} ${number(bottom)}Q${number(left)} ${number(bottom)} ${number(left)} ${number(bottom-radius)}V${number(top+radius)}Q${number(left)} ${number(top)} ${number(left+radius)} ${number(top)}Z`);
 return path.join(' ');
}

function PaperStack({width,height,spread}:{width:number;height:number;spread:boolean}){
 const colours=['#eee2cb','#f6edda','#e6d7ba','#f1e7d2'];
 return <svg className="reader-page-stack" viewBox={`-20 -3 ${width+37} ${height+36}`} style={{left:-20,top:-3,width:width+37,height:height+36} as CSSProperties} aria-hidden="true" focusable="false">
  <path d={leaf(width,height,30,spread,0)} fill="#21452b" stroke="#7b7548" strokeWidth=".8"/>
  {Array.from({length:38},(_,index)=><path key={index} d={leaf(width,height,1+25*(1-index/37),spread,index)} fill={colours[index%colours.length]} stroke="#ad9572" strokeOpacity=".62" strokeWidth=".35" strokeLinejoin="round"/>)}
  {!spread&&<path d={`M-3 1H2V${height+23}Q2 ${height+28} 12 ${height+29}H1Q-3 ${height+28} -3 ${height+23}Z`} fill="#315333"/>}
 </svg>;
}

export default memo(PaperStack);
