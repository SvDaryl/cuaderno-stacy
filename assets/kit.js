/* Kit compartido: gráficas, controles, paneles "¿dónde se usa?", preguntas, progreso y navegación. */
(function(){
const BASE = document.body.dataset.base || '';
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const cv = n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
/* m(): pega con espacio duro las operaciones (x − 1, 2 · 3) para que una fórmula no se parta a mitad de línea */
const m = s=>String(s).replace(/ ([+−·×\/]) /g,'\u00A0$1\u00A0');
const nf = (v,d=2)=>Number(v).toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const redraws = [];
const onRedraw = fn=>{redraws.push(fn);fn();};
const redrawAll = ()=>redraws.forEach(f=>{try{f();}catch(e){console.error(e);}});

/* ---------- progreso (solo en este navegador) ---------- */
const store = {
  get(k,d){try{const v=localStorage.getItem('cuaderno:'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem('cuaderno:'+k,JSON.stringify(v));}catch(e){}}
};
const progress = {
  all(){return store.get('vistos',{});},
  isDone(id){return !!this.all()[id];},
  set(id,on){const a=this.all();if(on)a[id]=Date.now();else delete a[id];store.set('vistos',a);}
};

/* ---------- iconos (SVG de trazo, estilo Lucide) ---------- */
const ICONS={
  check:'<path d="M20 6 9 17l-5-5"/>',
  left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
  play:'<path d="M7 4v16l13-8z"/>',pause:'<path d="M8 4v16M16 4v16"/>',again:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',flag:'<path d="M4 22V4s1.5-1 5-1 5 2 8 2 3-1 3-1v11s-1 1-3 1-5-2-8-2-5 1-5 1"/>',
  sound:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="1"/>'
};
const icon=(n,cls='')=>'<svg class="ico '+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';

/* ---------- barra superior y pie ---------- */
function chrome(){
  const nav=document.body.dataset.nav||'';
  const links=[['inicio','Inicio','index.html'],['matematica','Matemática','matematica/index.html'],['fisica','Física','fisica/index.html'],['ejemplos','Ejemplos','ejemplos/index.html'],['problemas','Problemas','problemas/index.html'],['examenes','Exámenes','examenes/index.html']];
  const ready=TEMAS.filter(t=>t.estado==='lista'),done=ready.filter(t=>progress.isDone(t.id)).length,p=ready.length?Math.round(done/ready.length*100):0;
  const h=document.createElement('header');h.className='top';
  h.innerHTML='<nav aria-label="Secciones"><a class="brand" href="'+BASE+'index.html"><i>'+icon('book')+'</i>'+SITE.nombre+'</a>'+
    links.map(l=>'<a class="l" href="'+BASE+l[2]+'"'+(nav===l[0]?' aria-current="page"':'')+'>'+l[1]+'</a>').join('')+
    '<a class="gp" href="'+BASE+'index.html" aria-label="Tu avance: '+done+' de '+ready.length+' lecciones entendidas"><span><b>'+done+'</b> de '+ready.length+' lecciones</span><span class="bar"><span style="--p:'+p+'%"></span></span></a></nav>';
  document.body.prepend(h);
  const f=document.createElement('footer');f.className='site';
  f.textContent='Hecho con cariño para '+SITE.apodo+'. Tu avance se guarda en esta laptop.';
  document.body.append(f);
}

/* ---------- gráficas ---------- */
/* s = cuánto agrandar textos, puntos y márgenes para que en el celular se lean igual que en la compu
   (el canvas se dibuja a su tamaño lógico data-w y luego se encoge al ancho de la pantalla) */
function prep(c){const dpr=Math.min(2,window.devicePixelRatio||1),w=+c.dataset.w||640,h0=+c.dataset.h||300,shown=c.clientWidth||w;
  const k=shown/w,s=Math.min(2.2,Math.max(1,0.9/k)),h=k<0.75?Math.round(h0*Math.min(1.5,0.75/k)):h0; /* en pantallas angostas, un poco más alta */
  const bw=Math.round(Math.max(shown,1)*dpr),bh=Math.round(bw*h/w);
  if(c.width!==bw)c.width=bw; if(c.height!==bh)c.height=bh;
  const x=c.getContext('2d');x.setTransform(bw/w,0,0,bh/h,0,0);return{x,w,h,s};}
function niceStep(r){const raw=r/6,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p;}
function fmtTick(v){const a=Math.abs(v);if(a>=1e6)return(v/1e6).toLocaleString('es-ES',{maximumFractionDigits:1})+' M';if(a>=1e4)return(v/1e3).toLocaleString('es-ES',{maximumFractionDigits:0})+' mil';return((Math.round(v*100)/100)||0).toLocaleString('es-ES');}
/* opciones: xr,yr, xs,ys, xl,yl, fns[{f,color,width,dash,from,to}], pts[{x,y,color,label,hollow}],
   xb:[[a,b,color]] franja en el eje x, fills:[{f,from,to,color,alpha}] área bajo la curva, yb:[[a,b,color]] franja en el eje y, vx:[{x,color}] rectas verticales */
function plot(c,o){
  const{x:g,w,h,s}=prep(c),L=Math.round(52*s),R=Math.round(14*s),T=Math.round(14*s),B=Math.round(34*s);
  const[x0,x1]=o.xr,[y0,y1]=o.yr,X=v=>L+(v-x0)/(x1-x0)*(w-L-R),Y=v=>h-B-(v-y0)/(y1-y0)*(h-T-B);
  const ink=cv('--muted'),line=cv('--line'),mono=(12*s).toFixed(1)+'px "JetBrains Mono", monospace';
  g.clearRect(0,0,w,h);g.font=mono;g.fillStyle=ink;g.lineWidth=s;g.strokeStyle=line;
  /* con letras más grandes caben menos números: si hace falta, se salta uno sí y uno no */
  const sx=o.xs||niceStep(x1-x0),sy=o.ys||niceStep(y1-y0);
  const ex=Math.max(1,Math.ceil(34*s/((w-L-R)/((x1-x0)/sx)))),ey=Math.max(1,Math.ceil(17*s/((h-T-B)/((y1-y0)/sy))));
  for(let v=Math.ceil(x0/sx)*sx;v<=x1+1e-9;v+=sx){g.beginPath();g.moveTo(X(v),T);g.lineTo(X(v),h-B);g.stroke();if(Math.round(v/sx)%ex===0){g.textAlign='center';g.fillText(fmtTick(v),X(v),h-B+18*s);}}
  for(let v=Math.ceil(y0/sy)*sy;v<=y1+1e-9;v+=sy){g.beginPath();g.moveTo(L,Y(v));g.lineTo(w-R,Y(v));g.stroke();if(Math.round(v/sy)%ey===0){g.textAlign='right';g.fillText(fmtTick(v),L-6*s,Y(v)+4*s);}}
  g.strokeStyle=ink;g.lineWidth=1.4*s;
  const ax=(y0<0&&y1>0)?Y(0):h-B, ay=(x0<0&&x1>0)?X(0):L;
  g.beginPath();g.moveTo(L,ax);g.lineTo(w-R,ax);g.stroke();
  g.beginPath();g.moveTo(ay,T);g.lineTo(ay,h-B);g.stroke();
  if(o.xl){g.textAlign='right';g.fillText(o.xl,w-R,h-4*s);} if(o.yl){g.textAlign='left';g.fillText(o.yl,L+6*s,T+10*s);}
  g.save();g.beginPath();g.rect(L,T,w-L-R,h-T-B);g.clip();
  for(const b of o.xb||[]){const a=Math.max(b[0],x0),e=Math.min(b[1],x1);if(e<=a)continue;g.fillStyle=b[2];g.globalAlpha=0.12;g.fillRect(X(a),T,X(e)-X(a),h-T-B);g.globalAlpha=1;g.fillRect(X(a),ax-4*s,X(e)-X(a),8*s);}
  for(const b of o.yb||[]){const a=Math.max(b[0],y0),e=Math.min(b[1],y1);if(e<=a)continue;g.fillStyle=b[2];g.globalAlpha=0.12;g.fillRect(L,Y(e),w-L-R,Y(a)-Y(e));g.globalAlpha=1;g.fillRect(ay-4*s,Y(e),8*s,Y(a)-Y(e));}
  for(const v of o.vx||[]){g.strokeStyle=v.color;g.lineWidth=2*s;g.setLineDash([6*s,5*s]);g.beginPath();g.moveTo(X(v.x),T);g.lineTo(X(v.x),h-B);g.stroke();g.setLineDash([]);}
  for(const a of o.fills||[]){ /* área entre la curva y el eje x: {f, from, to, color, alpha} */
    g.fillStyle=a.color;g.globalAlpha=a.alpha||0.2;g.beginPath();g.moveTo(X(a.from),Y(0));const N=a.n||120;
    for(let i=0;i<=N;i++){const xv=a.from+(a.to-a.from)*i/N;g.lineTo(X(xv),Y(a.f(xv)));}
    g.lineTo(X(a.to),Y(0));g.closePath();g.fill();g.globalAlpha=1;}
  for(const f of o.fns||[]){g.strokeStyle=f.color;g.lineWidth=(f.width||3)*s;g.setLineDash((f.dash||[]).map(d=>d*s));g.lineCap='round';g.lineJoin='round';g.beginPath();let pen=false,py=null;
    const a=f.from??x0,b=f.to??x1,N=f.n||500;
    for(let i=0;i<=N;i++){const xv=a+(b-a)*i/N,yv=f.f(xv),span=y1-y0;
      if(!isFinite(yv)||yv<y0-span*3||yv>y1+span*3||(py!==null&&Math.abs(yv-py)>span*2)){pen=false;py=isFinite(yv)?yv:null;continue;}
      pen?g.lineTo(X(xv),Y(yv)):g.moveTo(X(xv),Y(yv));pen=true;py=yv;}
    g.stroke();}
  g.setLineDash([]);
  for(const p of o.pts||[]){g.beginPath();g.arc(X(p.x),Y(p.y),6*s,0,7);
    if(p.hollow){g.fillStyle=cv('--card');g.fill();g.strokeStyle=p.color;g.lineWidth=2.5*s;g.stroke();}
    else{g.fillStyle=p.color;g.fill();g.strokeStyle=cv('--card');g.lineWidth=2*s;g.stroke();}
    if(p.label){g.fillStyle=cv('--ink');g.font='500 '+(13*s).toFixed(1)+'px Lexend, sans-serif';const right=X(p.x)+10*s+g.measureText(p.label).width>w-R;g.textAlign=right?'right':'left';g.fillText(p.label,X(p.x)+(right?-10:10)*s,Math.max(T+12*s,Y(p.y)-10*s));g.font=mono;}}
  g.restore();
  return{X,Y,L,R,T,B,w,h,s};
}

/* ---------- controles deslizantes ---------- */
function controls(host,defs,onIn){
  host.innerHTML='';const vals={};
  defs.forEach(d=>{vals[d.id]=d.val;
    const row=document.createElement('div');row.className='ctl';const uid='c_'+Math.random().toString(36).slice(2,8);
    row.innerHTML='<label for="'+uid+'">'+d.label+'</label><input type="range" id="'+uid+'" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+d.val+'"><output for="'+uid+'"></output>'+(d.hint?'<small>'+d.hint+'</small>':'');
    const inp=$('input',row),out=$('output',row);
    const show=()=>{vals[d.id]=+inp.value;out.textContent=d.fmt?d.fmt(+inp.value):inp.value;};
    inp.addEventListener('input',()=>{show();onIn(vals);});show();host.appendChild(row);});
  return vals;
}
function seg(host,onPick){const bs=$$('button',host);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b));onPick(b.dataset.k);}));}

/* ---------- paneles "¿dónde se usa?" ---------- */
const g=9.8;
let audio=null;
function stopTone(){if(audio){try{audio.osc.stop();audio.ctx.close();}catch(e){}audio=null;}}
const PANELS={
  funcion:{title:'Función: de Celsius a Fahrenheit',uses:['App del clima','Termómetros','Recetas en inglés'],
    intro:'Tu celular recibe la temperatura en °C y, si lo tienes en inglés, te la muestra en °F. Por dentro usa una función: entra C y sale F = 1,8·C + 32.',
    ctl:[{id:'c',label:'Temperatura',min:-20,max:45,step:1,val:18,fmt:v=>v+'\u202F°C'}],
    draw(v,c,r){const F=1.8*v.c+32;
      plot(c,{xr:[-20,45],yr:[-10,120],xl:'°C',yl:'°F',fns:[{f:x=>1.8*x+32,color:cv('--c1')}],pts:[{x:v.c,y:F,color:cv('--c2'),label:v.c+'\u202F°C → '+nf(F,1)+' °F'}]});
      r.innerHTML='Entra <b>'+v.c+' °C</b> → la máquina hace × 1,8 + 32 → sale <b>'+nf(F,1)+' °F</b>.'+(v.c>=30?' ¡Hace calor!':v.c<=0?' Está helando.':'');}},
  dominio:{title:'Dominio y rango: la batería de tu celular',uses:['Batería','Datos móviles','Tanque de gasolina'],
    intro:'Si la batería baja un poco cada hora, la carga es una función del tiempo. El dominio son las horas que tiene sentido usar (desde 0 hasta que se apaga) y el rango son los porcentajes posibles (de 0 % a 100 %).',
    ctl:[{id:'r',label:'Gasto por hora',min:5,max:25,step:1,val:12,fmt:v=>v+' %/h',hint:'Jugar o ver videos gasta más.'}],
    draw(v,c,r){const end=100/v.r;
      plot(c,{xr:[0,20],yr:[0,110],xs:2,ys:20,xl:'horas',yl:'%',xb:[[0,end,cv('--c1')]],yb:[[0,100,cv('--c2')]],fns:[{f:x=>100-v.r*x,color:cv('--c3'),from:0,to:end}],pts:[{x:end,y:0,color:cv('--c2'),label:'se apaga'}]});
      r.innerHTML='Dominio: <b>[0 ; '+nf(end,1)+'] horas</b>. Rango: <b>[0 ; 100] %</b>. Pasadas las '+nf(end,1)+' h la fórmula daría negativo, pero eso ya no tiene sentido: está fuera del dominio.';}},
  mru:{title:'MRU: la vagoneta de Minecraft',uses:['Vagonetas en minas','Rieles potenciados','Granjas automáticas'],
    intro:'En Minecraft, una vagoneta sobre un riel potenciado va a velocidad constante (como máximo 8 bloques por segundo). Cada segundo avanza lo mismo, así que la gráfica de distancia contra tiempo es una recta.',
    ctl:[{id:'v',label:'Velocidad',min:1,max:8,step:1,val:6,fmt:v=>v+' bloques/s',hint:'Más velocidad, recta más empinada.'},
         {id:'t',label:'Tiempo',min:0,max:30,step:1,val:12,fmt:v=>v+' s'}],
    draw(v,c,r){const d=v.v*v.t;
      plot(c,{xr:[0,30],yr:[0,240],xs:5,ys:40,xl:'segundos',yl:'bloques',fns:[{f:x=>v.v*x,color:cv('--c1')}],pts:[{x:v.t,y:d,color:cv('--c2'),label:d+' bloques'}]});
      r.innerHTML='A <b>'+v.v+' bloques/s</b>, en <b>'+v.t+' s</b> recorre '+v.v+' × '+v.t+' = <b>'+d+' bloques</b> (1 bloque = 1 m).';}},
  lineal:{title:'Función lineal: el precio de un taxi',uses:['Taxis y apps de viaje','Planes de celular','Recibo de luz'],
    intro:'Un taxi cobra un monto fijo al subir (la b) y un precio por cada kilómetro (la m, o pendiente). El total es y = m·x + b. Cada kilómetro suma lo mismo, por eso la gráfica es una recta.',
    ctl:[{id:'b',label:'Al subir (b)',min:0,max:10,step:0.5,val:4,fmt:v=>'S/ '+nf(v),hint:'Sube o baja la recta.'},
         {id:'m',label:'Por km (m)',min:0.5,max:4,step:0.1,val:1.5,fmt:v=>'S/ '+nf(v),hint:'La inclina: más caro el km, más empinada.'},
         {id:'d',label:'Distancia',min:0,max:20,step:1,val:8,fmt:v=>v+' km'}],
    draw(v,c,r){const y=v.m*v.d+v.b;
      plot(c,{xr:[0,20],yr:[0,90],xl:'km',yl:'S/',fns:[{f:x=>v.m*x+v.b,color:cv('--c1')}],pts:[{x:v.d,y,color:cv('--c2'),label:'S/ '+nf(y)}]});
      r.innerHTML='Un viaje de <b>'+v.d+' km</b> cuesta '+nf(v.b)+' + '+nf(v.m)+' × '+v.d+' = <b>S/ '+nf(y)+'</b>.';}},
  cuadratica:{title:'Parábola: el camino de un balón',uses:['Fútbol y básquet','Videojuegos','Antenas parabólicas'],
    intro:'Cuando pateas un balón, la gravedad lo frena al subir y lo jala hacia abajo. Su altura es una función cuadrática de la distancia, y su camino es una parábola. Los videojuegos usan esta misma fórmula para lanzar cosas.',
    ctl:[{id:'v',label:'Fuerza',min:5,max:30,step:1,val:18,fmt:v=>v+' m/s'},
         {id:'a',label:'Ángulo',min:10,max:80,step:1,val:35,fmt:v=>v+'°',hint:'Reto: ¿con qué ángulo llega más lejos?'}],
    draw(v,c,r){const t=v.a*Math.PI/180,R=v.v*v.v*Math.sin(2*t)/g,H=Math.pow(v.v*Math.sin(t),2)/(2*g);
      plot(c,{xr:[0,95],yr:[0,48],xs:10,ys:10,xl:'distancia (m)',yl:'altura (m)',fns:[{f:x=>x*Math.tan(t)-g*x*x/(2*v.v*v.v*Math.cos(t)**2),color:cv('--c2'),from:0,to:R}],pts:[{x:R/2,y:H,color:cv('--c1'),label:'máx. '+nf(H,1)+' m'},{x:R,y:0,color:cv('--c3'),label:nf(R,1)+' m'}]});
      r.innerHTML='Llega a <b>'+nf(R,1)+' m</b> y sube hasta <b>'+nf(H,1)+' m</b>.'+(v.a===45?' ¡45° es el ángulo que llega más lejos!':'');}},
  cubica:{title:'Función cúbica: la caja más grande',uses:['Empaques y cajas','Diseño de envases','Ingeniería'],
    intro:'Tienes una cartulina de 30 × 20 cm. Cortas un cuadrado de lado x en cada esquina y doblas los bordes para hacer una caja sin tapa. Su volumen es V(x) = x·(30 − 2x)·(20 − 2x): una función cúbica. ¿Qué corte da la caja más grande?',
    ctl:[{id:'x',label:'Corte x',min:0,max:10,step:0.1,val:2,fmt:v=>nf(v,1)+' cm'}],
    draw(v,c,r){const V=x=>x*(30-2*x)*(20-2*x),best=(50-Math.sqrt(700))/6;
      plot(c,{xr:[0,10],yr:[0,1200],xs:1,ys:200,xl:'corte x (cm)',yl:'cm³',fns:[{f:V,color:cv('--c4'),from:0,to:10}],pts:[{x:v.x,y:V(v.x),color:cv('--c2'),label:nf(V(v.x),0)+' cm³'}]});
      r.innerHTML='Caja de <b>'+nf(30-2*v.x,1)+' × '+nf(20-2*v.x,1)+' × '+nf(v.x,1)+' cm</b> → volumen <b>'+nf(V(v.x),0)+' cm³</b>.'+(Math.abs(v.x-best)<0.06?' ¡Esa es la más grande! (Con derivadas se calcula exacto: x ≈ 3,92 cm).':'');}},
  exponencial:{title:'Exponencial: un chisme en WhatsApp',uses:['Mensajes virales','Bacterias','Ahorros e intereses'],
    intro:'Cada hora, cada persona que conoce el chisme se lo reenvía a algunos amigos. La cantidad de gente que lo sabe se multiplica cada hora: y = kˣ. Al principio parece poco… y de pronto explota.',
    ctl:[{id:'k',label:'Amigos por persona',min:2,max:5,step:1,val:3,fmt:v=>'× '+v},
         {id:'t',label:'Horas',min:0,max:12,step:1,val:6,fmt:v=>v+' h'}],
    draw(v,c,r){const N=Math.pow(v.k,v.t),top=Math.max(10,N*1.25);
      plot(c,{xr:[0,12],yr:[0,top],xs:1,xl:'horas',yl:'personas',fns:[{f:x=>Math.pow(v.k,x),color:cv('--c3')}],pts:[{x:v.t,y:N,color:cv('--c2'),label:Math.round(N).toLocaleString('es-ES',{useGrouping:'always'})}]});
      r.innerHTML='En <b>'+v.t+' h</b> lo saben <b>'+Math.round(N).toLocaleString('es-ES',{useGrouping:'always'})+'</b> personas.'+(N>34e6?' ¡Ya lo sabe todo el Perú (unos 34 millones)!':N>1e6?' Más que una ciudad grande.':'');}},
  log:{title:'Logaritmo: la fuerza de un sismo',uses:['Sismos (magnitud)','Sonido (decibeles)','pH en química'],
    intro:'La magnitud de un sismo es un logaritmo: cada punto más significa que la tierra se mueve 10 veces más y libera unas 32 veces más energía. Por eso un sismo de 8 no es “un poquito” más fuerte que uno de 7. En Perú esto importa mucho.',
    ctl:[{id:'a',label:'Sismo A',min:3,max:9,step:0.1,val:6,fmt:v=>nf(v,1)},{id:'b',label:'Sismo B',min:3,max:9,step:0.1,val:8,fmt:v=>nf(v,1)}],
    draw(v,c,r){const E=m=>Math.pow(10,1.5*(m-3)),hi=Math.max(v.a,v.b),lo=Math.min(v.a,v.b),ratio=Math.pow(10,1.5*(hi-lo));
      plot(c,{xr:[3,9],yr:[0,Math.max(E(hi)*1.2,10)],xs:1,xl:'magnitud',yl:'energía (vs. sismo de 3)',fns:[{f:E,color:cv('--c2')}],pts:[{x:v.a,y:E(v.a),color:cv('--c1'),label:'A'},{x:v.b,y:E(v.b),color:cv('--c3'),label:'B'}]});
      r.innerHTML='El sismo de <b>'+nf(hi,1)+'</b> libera unas <b>'+Math.round(ratio).toLocaleString('es-ES',{useGrouping:'always'})+' veces</b> más energía que el de '+nf(lo,1)+'. La magnitud M = log₁₀(amplitud) “aplana” esos números gigantes en una escala del 1 al 10.';}},
  seno:{title:'Función seno: el sonido de una nota',uses:['Música','Audífonos y parlantes','Señal de radio y wifi'],
    intro:'Un sonido puro es una onda seno: y = A·sen(2π·f·t). La amplitud A es el volumen y la frecuencia f es el tono: más vueltas por segundo, más agudo. La nota La de un afinador vibra 440 veces por segundo.',
    ctl:[{id:'A',label:'Volumen (A)',min:0.1,max:1,step:0.05,val:0.6,fmt:v=>nf(v,2)},{id:'f',label:'Tono (f)',min:220,max:880,step:1,val:440,fmt:v=>v+' Hz'}],
    extra:'<div class="row"><button class="btn" type="button" id="toneBtn">'+icon('sound')+'Escuchar</button><span class="muted" style="font-size:14px">Baja el volumen de la laptop primero.</span></div>',
    draw(v,c,r){plot(c,{xr:[0,10],yr:[-1.1,1.1],xs:1,ys:0.5,xl:'milisegundos',fns:[{f:t=>v.A*Math.sin(2*Math.PI*v.f*t/1000),color:cv('--c1'),width:2.5,n:900}]});
      const notes=[[220,'La grave'],[262,'Do'],[330,'Mi'],[392,'Sol'],[440,'La'],[523,'Do agudo'],[659,'Mi agudo'],[880,'La agudo']];let near=notes.reduce((a,b)=>Math.abs(b[0]-v.f)<Math.abs(a[0]-v.f)?b:a);
      r.innerHTML='En 10 milisegundos la onda da <b>'+nf(v.f/100,1)+'</b> vueltas. Suena parecido a <b>'+near[1]+'</b>.';
      if(audio){audio.osc.frequency.setTargetAtTime(v.f,audio.ctx.currentTime,0.02);audio.gain.gain.setTargetAtTime(v.A*0.25,audio.ctx.currentTime,0.02);}},
    mount(vals){const b=$('#toneBtn');b.addEventListener('click',()=>{
      if(audio){stopTone();b.innerHTML=icon('sound')+'Escuchar';return;}
      try{const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC(),osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.type='sine';osc.frequency.value=vals.f;gain.gain.value=vals.A*0.25;osc.connect(gain).connect(ctx.destination);osc.start();audio={ctx,osc,gain};b.innerHTML=icon('stop')+'Parar';}
      catch(e){b.textContent='Tu navegador no dejó reproducir el sonido';}});}}
};
let dlg=null,cur=null,curVals=null;
function ensureDialog(){
  if(dlg)return;
  dlg=document.createElement('dialog');dlg.setAttribute('aria-labelledby','pT');
  dlg.innerHTML='<div class="sheet"><header><h3 id="pT"></h3><button class="close" type="button" aria-label="Cerrar">'+icon('x')+'</button></header><div class="uses" id="pU"></div><p id="pI"></p><div class="canvaswrap"><canvas id="pC" data-w="640" data-h="300"></canvas></div><div id="pCtl"></div><div id="pX"></div><div class="readout" id="pR" aria-live="polite"></div></div>';
  document.body.append(dlg);
  $('.close',dlg).addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
  dlg.addEventListener('close',stopTone);
}
function openPanel(k){
  const p=PANELS[k];if(!p)return;ensureDialog();cur=p;
  $('#pT').textContent=p.title;$('#pI').textContent=p.intro;$('#pU').innerHTML='Se usa en '+p.uses.map(u=>'<span>'+u+'</span>').join('');
  $('#pX').innerHTML=p.extra||'';
  curVals=controls($('#pCtl'),p.ctl,vv=>{curVals=vv;p.draw(vv,$('#pC'),$('#pR'));});
  dlg.showModal();p.draw(curVals,$('#pC'),$('#pR'));if(p.mount)p.mount(curVals);
}
function bindTerms(root=document){
  $$('[data-p]',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound=1;
    b.addEventListener('click',()=>openPanel(b.dataset.p));
    if(b.tagName!=='BUTTON'&&b.tagName!=='A')b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPanel(b.dataset.p);}});});
}

/* ---------- preguntas rápidas ---------- */
function quiz(root=document){
  $$('.q[data-ans]',root).forEach(q=>{const fb=$('.fb',q);
    $$('input',q).forEach(i=>i.addEventListener('change',()=>{fb.textContent='';fb.className='fb';}));
    $('.btn',q).addEventListener('click',()=>{const s=$('input:checked',q);
      if(!s){fb.textContent='Elige una respuesta primero.';fb.className='fb no';return;}
      if(s.value===q.dataset.ans){fb.textContent=$('template',q).content.textContent.trim();fb.className='fb ok';}
      else{fb.textContent=q.dataset.hint||'Casi. Revisa la lección y vuelve a intentar.';fb.className='fb no';}});});
}

/* ---------- navegación entre lecciones ---------- */
/* lessonNav('id'): arma el curso alrededor de la lección (barra lateral con las unidades de la materia,
   columna derecha con el avance y "Siguiente") y pone anterior / entendido / siguiente al final. */
function lessonNav(id){
  const t=TEMAS.find(x=>x.id===id);if(!t)return;
  const mat=MATERIAS.find(x=>x.id===t.materia)||{nombre:''};
  const all=TEMAS.filter(x=>x.materia===t.materia),bloques=[...new Set(all.map(x=>x.bloque))];
  const list=TEMAS.filter(x=>x.bloque===t.bloque&&x.estado==='lista'),i=list.indexOf(t),prev=list[i-1],next=list[i+1];
  const mapUrl=BASE+t.materia+'/index.html';
  const main=$('main');
  if(main&&!main.parentElement.classList.contains('shell')){
    const shell=document.createElement('div');shell.className='shell';main.before(shell);
    const side=document.createElement('aside');side.className='side';side.setAttribute('aria-label','Lecciones de '+mat.nombre);
    const rail=document.createElement('aside');rail.className='rail';rail.setAttribute('aria-label','Tu avance');
    shell.append(side,main,rail);
    const paintSide=()=>{
      const ready=all.filter(x=>x.estado==='lista'),d=ready.filter(x=>progress.isDone(x.id)).length;
      let n=0;
      side.innerHTML='<h2><a href="'+mapUrl+'" style="color:inherit;text-decoration:none">'+mat.nombre+'</a></h2><p class="sub">'+d+' de '+ready.length+' lecciones entendidas</p>'+
        '<span class="bar"><span style="--p:'+(ready.length?d/ready.length*100:0)+'%"></span></span>'+
        bloques.map(b=>'<h3>'+b+'</h3>'+all.filter(x=>x.bloque===b).map(x=>{n++;
          if(x.estado!=='lista')return '<div class="lk soon"><span class="dot">'+n+'</span><span>'+x.titulo+'<small>Muy pronto</small></span></div>';
          const ok=progress.isDone(x.id);
          return '<a class="lk'+(ok?' done':'')+'" href="'+BASE+x.url+'"'+(x.id===id?' aria-current="page"':'')+'><span class="dot">'+(ok?icon('check'):n)+'</span><span>'+x.titulo+'</span></a>';}).join('')).join('');
      const ub=list.filter(x=>progress.isDone(x.id)).length;
      const key=$('main .key[data-idea]')||$('main .key'); /* data-idea marca cuál es la idea clave de la lección */
      const end=t.materia==='matematica'?['examenes/index.html','Ir a exámenes']:['problemas/index.html','Ir a problemas'];
      rail.innerHTML='<div class="box"><button class="btn done-btn" type="button" aria-pressed="false"></button>'+
        (next?'<a class="btn ghost" href="'+BASE+next.url+'">Siguiente'+icon('right')+'</a><p>Sigue: '+next.titulo+'</p>':'<a class="btn ghost" href="'+BASE+end[0]+'">'+end[1]+icon('right')+'</a><p>Terminaste lo que hay de '+t.bloque+' por ahora.</p>')+'</div>'+(key?'<div class="box idea"><h2>Idea clave</h2>'+key.innerHTML+'</div>':'')+'<div class="box"><h2>'+t.bloque+'</h2><span class="bar"><span style="--p:'+(list.length?ub/list.length*100:0)+'%"></span></span><p>'+ub+' de '+list.length+' lecciones listas de esta unidad.</p></div>';
      wireDone();
    };
    paintSides.push(paintSide);paintSide();
  }
  const host=$('#lessonnav');
  if(host){
    host.innerHTML=(prev?'<a class="btn ghost" href="'+BASE+prev.url+'">'+icon('left')+prev.titulo+'</a>':'<a class="btn ghost" href="'+mapUrl+'">'+icon('map')+'Mapa de '+mat.nombre+'</a>')+
      '<button class="btn done-btn" type="button" aria-pressed="false"></button>'+
      (next?'<a class="btn ghost" href="'+BASE+next.url+'">'+next.titulo+icon('right')+'</a>':(t.materia==='matematica'?'<a class="btn ghost" href="'+BASE+'examenes/index.html">Ir a los exámenes'+icon('right')+'</a>':'<a class="btn ghost" href="'+BASE+'problemas/index.html">Practica con problemas'+icon('right')+'</a>'));
  }
  function wireDone(){$$('.done-btn').forEach(b=>{if(b.dataset.w)return;b.dataset.w=1;b.addEventListener('click',()=>{progress.set(id,!progress.isDone(id));paintSides.forEach(f=>f());paintDone();});});paintDone();}
  function paintDone(){const d=progress.isDone(id);$$('.done-btn').forEach(b=>{b.setAttribute('aria-pressed',d);b.innerHTML=d?icon('check')+'Entendido':'Lo entendí';b.setAttribute('aria-label',d?'Lección marcada como entendida. Toca para desmarcar':'Marcar la lección como entendida');});
    const top=$('.top .gp');if(top){const r=TEMAS.filter(x=>x.estado==='lista'),dn=r.filter(x=>progress.isDone(x.id)).length;top.querySelector('b').textContent=dn;top.querySelector('.bar>span').style.setProperty('--p',(r.length?dn/r.length*100:0)+'%');}}
  wireDone();
}
const paintSides=[];

/* ---------- escena estilo Minecraft (dibujada con cuadrados, sin imágenes) ---------- */
/* scene(g,w,h,s,{rails}) pinta cielo, nubes y suelo y devuelve {gy,B,u}: gy = altura del suelo, B = lado de un bloque, u = "pixel" de los dibujos.
   cart(g,cx,gy,u) dibuja la vagoneta con las ruedas sobre el riel. */
const mc={
  hash:(i,j)=>{const n=Math.sin(i*127.1+j*311.7)*43758.5453;return n-Math.floor(n);},
  scene(g,w,h,s,o={}){
    const B=Math.max(10,Math.round(12*s)),u=Math.max(3,Math.round(4.5*s)),gy=Math.round(h*0.62/B)*B;
    g.fillStyle=cv('--mc-sky');g.fillRect(0,0,w,gy);
    g.fillStyle=cv('--mc-cloud');g.globalAlpha=0.9;
    for(const[fx,fy,n]of[[0.08,0.16,4],[0.5,0.06,5],[0.8,0.24,3]]){const x=Math.round(fx*w/B)*B,y=Math.max(B,Math.round(fy*gy/B)*B);g.fillRect(x,y,n*B,B);g.fillRect(x+B,y-B,(n-2)*B,B);}
    g.globalAlpha=1;
    const g1=cv('--mc-grass'),g2=cv('--mc-grass2'),d1=cv('--mc-dirt'),d2=cv('--mc-dirt2'),q=Math.round(B/4);
    for(let j=0;gy+j*B<h;j++)for(let i=0;i*B<w;i++){
      const x=i*B,y=gy+j*B;
      g.fillStyle=d1;g.fillRect(x,y,B,B);
      if(j===0){g.fillStyle=g1;g.fillRect(x,y,B,Math.round(B*0.4));}
      for(let k=0;k<4;k++){const r=mc.hash(i*4+k,j);if(r>0.55){g.fillStyle=(j===0&&k<2)?g2:d2;g.fillRect(x+q*(k%4),y+Math.round(q*(1+((r*10)|0)%3)),q,q);}}
    }
    if(o.rails){ /* riel: barra gris + durmientes de madera */
      g.fillStyle=cv('--mc-wood');for(let x=Math.round(B*0.4);x<w;x+=Math.round(B*1.4))g.fillRect(x,gy-u,Math.round(u*1.6),u);
      g.fillStyle=cv('--mc-iron');g.fillRect(0,gy-u,w,Math.max(1,Math.round(u/2)));}
    return{gy,B,u};
  },
  cart(g,cx,gy,u){
    cx=Math.round(cx);const x=cx-6*u,y=gy-8*u;
    g.fillStyle=cv('--mc-iron');g.fillRect(x,y,12*u,5*u);
    g.fillStyle=cv('--mc-iron-d');g.fillRect(x+u,y,10*u,3*u);
    g.fillRect(cx-4*u,gy-3*u,2*u,2*u);g.fillRect(cx+2*u,gy-3*u,2*u,2*u);
  }
};

window.Kit={$,$$,cv,nf,m,mc,icon,plot,prep,controls,seg,PANELS,openPanel,bindTerms,quiz,progress,store,lessonNav,onRedraw,BASE};

chrome();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindTerms();quiz();});
else{bindTerms();quiz();}
document.fonts&&document.fonts.ready.then(redrawAll);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{redrawAll();if(dlg&&dlg.open&&cur)cur.draw(curVals,$('#pC'),$('#pR'));});
new MutationObserver(redrawAll).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
/* al cambiar el tamaño de la ventana, se redibuja una sola vez (no en cada píxel) */
let lastW=window.innerWidth,rz=0;
window.addEventListener('resize',()=>{if(window.innerWidth===lastW)return;lastW=window.innerWidth;cancelAnimationFrame(rz);
  rz=requestAnimationFrame(()=>{redrawAll();if(dlg&&dlg.open&&cur)cur.draw(curVals,$('#pC'),$('#pR'));});});
})();
