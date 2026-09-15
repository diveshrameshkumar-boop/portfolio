(() => {
  const root = document.documentElement;
  const boot = document.querySelector('.boot');
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  addEventListener('load', () => setTimeout(() => { boot.classList.add('done'); document.body.classList.add('ready'); }, 450));
  if (document.readyState === 'complete') setTimeout(() => { boot.classList.add('done'); document.body.classList.add('ready'); }, 450);

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold:.12, rootMargin:'0px 0px -7% 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const navLinks = [...document.querySelectorAll('.nav nav a')];
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), {rootMargin:'-32% 0px -58% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
  const update = () => { nav.classList.toggle('scrolled', scrollY > 42); root.style.setProperty('--scroll', `${Math.min(scrollY / (document.body.scrollHeight - innerHeight), 1)}`); };
  addEventListener('scroll', update, {passive:true}); update();
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }));
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    const glow = document.querySelector('.cursor-glow'); const media = document.querySelector('.hero-media img');
    addEventListener('pointermove', e => { root.style.setProperty('--mx', `${e.clientX}px`); root.style.setProperty('--my', `${e.clientY}px`); glow.classList.add('on'); const x=(e.clientX/innerWidth-.5)*10, y=(e.clientY/innerHeight-.5)*8; media.style.transform=`scale(1.045) translate(${x}px,${y}px)`; }, {passive:true});
    document.querySelectorAll('.project').forEach(card => card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-7px)`; }));
    document.querySelectorAll('.project').forEach(card => card.addEventListener('pointerleave', () => card.style.transform=''));
  }
  const canvas = document.querySelector('#signal-field');
  if (canvas && !reduce) {
    const context = canvas.getContext('2d'); let width, height, dots, frame;
    const resize = () => { const ratio=Math.min(devicePixelRatio, 2); width=canvas.clientWidth; height=canvas.clientHeight; canvas.width=width*ratio; canvas.height=height*ratio; context.setTransform(ratio,0,0,ratio,0,0); const total=Math.min(48, Math.max(20, Math.round(width/32))); dots=Array.from({length:total}, () => ({x:width*(.48+Math.random()*.5),y:Math.random()*height,dx:(Math.random()-.5)*.13,dy:(Math.random()-.5)*.13,r:Math.random()*1.3+.3})); };
    const draw = () => { context.clearRect(0,0,width,height); dots.forEach(dot => { dot.x+=dot.dx;dot.y+=dot.dy;if(dot.x<width*.45||dot.x>width)dot.dx*=-1;if(dot.y<0||dot.y>height)dot.dy*=-1; }); for(let i=0;i<dots.length;i++){for(let j=i+1;j<dots.length;j++){const a=dots[i],b=dots[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<110){context.beginPath();context.strokeStyle=`rgba(215,255,90,${.08*(1-d/110)})`;context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();}}} dots.forEach(dot=>{context.beginPath();context.arc(dot.x,dot.y,dot.r,0,Math.PI*2);context.fillStyle='rgba(215,255,90,.46)';context.fill();}); frame=requestAnimationFrame(draw); };
    const watch = new ResizeObserver(resize);watch.observe(canvas);resize();draw();addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  }
})();
