/* Kit compartido: gráficas, controles, paneles "¿dónde se usa?", preguntas, progreso y navegación. */
(function(){
const BASE = document.body.dataset.base || '';
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const cv = n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
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

/* ---------- barra superior y pie ---------- */
function chrome(){
  const nav=document.body.dataset.nav||'';
  const links=[['inicio','Inicio','index.html'],['matematica','Matemática','matematica/index.html'],['ejemplos','Ejemplos','ejemplos/index.html'],['problemas','Problemas','problemas/index.html'],['examenes','Exámenes','examenes/index.html']];
  const h=document.createElement('header');h.className='top';
  h.innerHTML='<nav aria-label="Secciones"><a class="brand" href="'+BASE+'index.html">'+SITE.nombre+'</a>'+
    links.map(l=>'<a class="l" href="'+BASE+l[2]+'"'+(nav===l[0]?' aria-current="page"':'')+'>'+l[1]+'</a>').join('')+'</nav>';
  document.body.prepend(h);
  const f=document.createElement('footer');f.className='site';
  f.textContent='Hecho con cariño para '+SITE.apodo+'. Tu avance se guarda en este celular.';
  document.body.append(f);
}

/* ---------- gráficas ---------- */
function prep(c){const dpr=Math.min(2,window.devicePixelRatio||1),w=+c.dataset.w||640,h=+c.dataset.h||300;c.width=w*dpr;c.height=h*dpr;const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return{x,w,h};}
function niceStep(r){const raw=r/6,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p;}
function fmtTick(v){const a=Math.abs(v);if(a>=1e6)return(v/1e6).toLocaleString('es-ES',{maximumFractionDigits:1})+' M';if(a>=1e4)return(v/1e3).toLocaleString('es-ES',{maximumFractionDigits:0})+' mil';return(Math.round(v*100)/100).toLocaleString('es-ES');}
/* opciones: xr,yr, xs,ys, xl,yl, fns[{f,color,width,dash,from,to}], pts[{x,y,color,label,hollow}],
   xb:[[a,b,color]] franja en el eje x, yb:[[a,b,color]] franja en el eje y, vx:[{x,color}] rectas verticales */
function plot(c,o){
  const{x:g,w,h}=prep(c),L=50,R=14,T=14,B=34;
  const[x0,x1]=o.xr,[y0,y1]=o.yr,X=v=>L+(v-x0)/(x1-x0)*(w-L-R),Y=v=>h-B-(v-y0)/(y1-y0)*(h-T-B);
  const ink=cv('--muted'),line=cv('--line');
  g.clearRect(0,0,w,h);g.font='12px "JetBrains Mono", monospace';g.fillStyle=ink;g.lineWidth=1;g.strokeStyle=line;
  const sx=o.xs||niceStep(x1-x0),sy=o.ys||niceStep(y1-y0);
  for(let v=Math.ceil(x0/sx)*sx;v<=x1+1e-9;v+=sx){g.beginPath();g.moveTo(X(v),T);g.lineTo(X(v),h-B);g.stroke();g.textAlign='center';g.fillText(fmtTick(v),X(v),h-B+18);}
  for(let v=Math.ceil(y0/sy)*sy;v<=y1+1e-9;v+=sy){g.beginPath();g.moveTo(L,Y(v));g.lineTo(w-R,Y(v));g.stroke();g.textAlign='right';g.fillText(fmtTick(v),L-6,Y(v)+4);}
  g.strokeStyle=ink;g.lineWidth=1.4;
  const ax=(y0<0&&y1>0)?Y(0):h-B, ay=(x0<0&&x1>0)?X(0):L;
  g.beginPath();g.moveTo(L,ax);g.lineTo(w-R,ax);g.stroke();
  g.beginPath();g.moveTo(ay,T);g.lineTo(ay,h-B);g.stroke();
  if(o.xl){g.textAlign='right';g.fillText(o.xl,w-R,h-4);} if(o.yl){g.textAlign='left';g.fillText(o.yl,L+6,T+10);}
  g.save();g.beginPath();g.rect(L,T,w-L-R,h-T-B);g.clip();
  for(const b of o.xb||[]){const a=Math.max(b[0],x0),e=Math.min(b[1],x1);if(e<=a)continue;g.fillStyle=b[2];g.globalAlpha=0.12;g.fillRect(X(a),T,X(e)-X(a),h-T-B);g.globalAlpha=1;g.fillRect(X(a),ax-4,X(e)-X(a),8);}
  for(const b of o.yb||[]){const a=Math.max(b[0],y0),e=Math.min(b[1],y1);if(e<=a)continue;g.fillStyle=b[2];g.globalAlpha=0.12;g.fillRect(L,Y(e),w-L-R,Y(a)-Y(e));g.globalAlpha=1;g.fillRect(ay-4,Y(e),8,Y(a)-Y(e));}
  for(const v of o.vx||[]){g.strokeStyle=v.color;g.lineWidth=2;g.setLineDash([6,5]);g.beginPath();g.moveTo(X(v.x),T);g.lineTo(X(v.x),h-B);g.stroke();g.setLineDash([]);}
  for(const f of o.fns||[]){g.strokeStyle=f.color;g.lineWidth=f.width||3;g.setLineDash(f.dash||[]);g.lineCap='round';g.lineJoin='round';g.beginPath();let pen=false,py=null;
    const a=f.from??x0,b=f.to??x1,N=f.n||500;
    for(let i=0;i<=N;i++){const xv=a+(b-a)*i/N,yv=f.f(xv),span=y1-y0;
      if(!isFinite(yv)||yv<y0-span*3||yv>y1+span*3||(py!==null&&Math.abs(yv-py)>span*2)){pen=false;py=isFinite(yv)?yv:null;continue;}
      pen?g.lineTo(X(xv),Y(yv)):g.moveTo(X(xv),Y(yv));pen=true;py=yv;}
    g.stroke();}
  g.setLineDash([]);
  for(const p of o.pts||[]){g.beginPath();g.arc(X(p.x),Y(p.y),6,0,7);
    if(p.hollow){g.fillStyle=cv('--card');g.fill();g.strokeStyle=p.color;g.lineWidth=2.5;g.stroke();}
    else{g.fillStyle=p.color;g.fill();g.strokeStyle=cv('--card');g.lineWidth=2;g.stroke();}
    if(p.label){g.fillStyle=cv('--ink');g.font='500 13px Lexend, sans-serif';const right=X(p.x)>w-140;g.textAlign=right?'right':'left';g.fillText(p.label,X(p.x)+(right?-10:10),Math.max(T+12,Y(p.y)-10));g.font='12px "JetBrains Mono", monospace';}}
  g.restore();
  return{X,Y,L,R,T,B,w,h};
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
    ctl:[{id:'c',label:'Temperatura',min:-20,max:45,step:1,val:18,fmt:v=>v+' °C'}],
    draw(v,c,r){const F=1.8*v.c+32;
      plot(c,{xr:[-20,45],yr:[-10,120],xl:'°C',yl:'°F',fns:[{f:x=>1.8*x+32,color:cv('--c1')}],pts:[{x:v.c,y:F,color:cv('--c2'),label:v.c+' °C → '+nf(F,1)+' °F'}]});
      r.innerHTML='Entra <b>'+v.c+' °C</b> → la máquina hace × 1,8 + 32 → sale <b>'+nf(F,1)+' °F</b>.'+(v.c>=30?' ¡Hace calor!':v.c<=0?' Está helando.':'');}},
  dominio:{title:'Dominio y rango: la batería de tu celular',uses:['Batería','Datos móviles','Tanque de gasolina'],
    intro:'Si la batería baja un poco cada hora, la carga es una función del tiempo. El dominio son las horas que tiene sentido usar (desde 0 hasta que se apaga) y el rango son los porcentajes posibles (de 0 % a 100 %).',
    ctl:[{id:'r',label:'Gasto por hora',min:5,max:25,step:1,val:12,fmt:v=>v+' %/h',hint:'Jugar o ver videos gasta más.'}],
    draw(v,c,r){const end=100/v.r;
      plot(c,{xr:[0,20],yr:[0,110],xs:2,ys:20,xl:'horas',yl:'%',xb:[[0,end,cv('--c1')]],yb:[[0,100,cv('--c2')]],fns:[{f:x=>100-v.r*x,color:cv('--c3'),from:0,to:end}],pts:[{x:end,y:0,color:cv('--c2'),label:'se apaga'}]});
      r.innerHTML='Dominio: <b>[0 ; '+nf(end,1)+'] horas</b>. Rango: <b>[0 ; 100] %</b>. Pasadas las '+nf(end,1)+' h la fórmula daría negativo, pero eso ya no tiene sentido: está fuera del dominio.';}},
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
    extra:'<div class="row"><button class="btn" type="button" id="toneBtn">▶ Escuchar</button><span class="muted" style="font-size:14px">Baja el volumen del celular primero.</span></div>',
    draw(v,c,r){plot(c,{xr:[0,10],yr:[-1.1,1.1],xs:1,ys:0.5,xl:'milisegundos',fns:[{f:t=>v.A*Math.sin(2*Math.PI*v.f*t/1000),color:cv('--c1'),width:2.5,n:900}]});
      const notes=[[220,'La grave'],[262,'Do'],[330,'Mi'],[392,'Sol'],[440,'La'],[523,'Do agudo'],[659,'Mi agudo'],[880,'La agudo']];let near=notes.reduce((a,b)=>Math.abs(b[0]-v.f)<Math.abs(a[0]-v.f)?b:a);
      r.innerHTML='En 10 milisegundos la onda da <b>'+nf(v.f/100,1)+'</b> vueltas. Suena parecido a <b>'+near[1]+'</b>.';
      if(audio){audio.osc.frequency.setTargetAtTime(v.f,audio.ctx.currentTime,0.02);audio.gain.gain.setTargetAtTime(v.A*0.25,audio.ctx.currentTime,0.02);}},
    mount(vals){const b=$('#toneBtn');b.addEventListener('click',()=>{
      if(audio){stopTone();b.textContent='▶ Escuchar';return;}
      try{const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC(),osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.type='sine';osc.frequency.value=vals.f;gain.gain.value=vals.A*0.25;osc.connect(gain).connect(ctx.destination);osc.start();audio={ctx,osc,gain};b.textContent='■ Parar';}
      catch(e){b.textContent='Tu navegador no dejó reproducir el sonido';}});}}
};
let dlg=null,cur=null,curVals=null;
function ensureDialog(){
  if(dlg)return;
  dlg=document.createElement('dialog');dlg.setAttribute('aria-labelledby','pT');
  dlg.innerHTML='<div class="sheet"><header><div><p class="kick">¿Dónde se usa?</p><h3 id="pT"></h3></div><button class="close" type="button" aria-label="Cerrar">×</button></header><div class="uses" id="pU"></div><p id="pI"></p><div class="canvaswrap"><canvas id="pC" data-w="640" data-h="300"></canvas></div><div id="pCtl"></div><div id="pX"></div><div class="readout" id="pR" aria-live="polite"></div></div>';
  document.body.append(dlg);
  $('.close',dlg).addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
  dlg.addEventListener('close',stopTone);
}
function openPanel(k){
  const p=PANELS[k];if(!p)return;ensureDialog();cur=p;
  $('#pT').textContent=p.title;$('#pI').textContent=p.intro;$('#pU').innerHTML=p.uses.map(u=>'<span>'+u+'</span>').join('');
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
function lessonNav(id){
  const host=$('#lessonnav');if(!host)return;
  const t=TEMAS.find(x=>x.id===id),list=TEMAS.filter(x=>x.bloque===t.bloque&&x.estado==='lista'),i=list.indexOf(t);
  const prev=list[i-1],next=list[i+1];
  host.innerHTML=(prev?'<a class="btn ghost" href="'+BASE+prev.url+'">← '+prev.titulo+'</a>':'<a class="btn ghost" href="'+BASE+'matematica/index.html">← Mapa de temas</a>')+
    '<button class="btn done-btn" type="button" aria-pressed="false"></button>'+
    (next?'<a class="btn ghost" href="'+BASE+next.url+'">'+next.titulo+' →</a>':'<a class="btn ghost" href="'+BASE+'examenes/index.html">Ir a los exámenes →</a>');
  const b=$('.done-btn',host),paint=()=>{const d=progress.isDone(id);b.setAttribute('aria-pressed',d);b.textContent=d?'✓ Ya lo entendí':'Marcar como entendido';};
  b.addEventListener('click',()=>{progress.set(id,!progress.isDone(id));paint();});paint();
}

window.Kit={$,$$,cv,nf,plot,prep,controls,seg,PANELS,openPanel,bindTerms,quiz,progress,store,lessonNav,onRedraw,BASE};

chrome();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindTerms();quiz();});
else{bindTerms();quiz();}
document.fonts&&document.fonts.ready.then(redrawAll);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{redrawAll();if(dlg&&dlg.open&&cur)cur.draw(curVals,$('#pC'),$('#pR'));});
new MutationObserver(redrawAll).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
