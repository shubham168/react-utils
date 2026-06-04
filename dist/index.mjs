import{useEffect as f,useRef as u}from"react";function a(e,c=[]){let t=u(e);f(()=>{let n={};e.forEach((r,o)=>{let s=t.current[o];Object.is(r,s)||(n[c[o]??String(o)]={from:s,to:r})}),Object.keys(n).length>0&&(console.group("useEffect re-ran because:"),console.table(n),console.groupEnd()),t.current=e})}export{a as useWhyEffectRan};
//# sourceMappingURL=index.mjs.map
