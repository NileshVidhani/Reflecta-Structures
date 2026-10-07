document.addEventListener("DOMContentLoaded",()=>{
  const header=document.querySelector(".site-header");
  const nav=document.querySelector(".primary-nav");
  const mobile=document.querySelector(".mobile-toggle");
  const productNav=document.querySelector(".products-nav");
  const trigger=document.querySelector(".products-trigger");

  const onScroll=()=>header&&header.classList.toggle("scrolled",window.scrollY>18);
  onScroll(); window.addEventListener("scroll",onScroll,{passive:true});

  // Active page state.
  const path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const map={"index.html":"home","about.html":"about","projects.html":"projects","contact.html":"contact"};
  const active=map[path];
  if(active){const el=document.querySelector(`[data-nav="${active}"]`);if(el)el.classList.add("active")}

  // Mobile navigation.
  mobile?.addEventListener("click",()=>{
    const open=nav.classList.toggle("mobile-open");
    mobile.classList.toggle("open",open);
    mobile.setAttribute("aria-expanded",String(open));
    mobile.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    if(!open) closeProducts();
  });

  function openProducts(){
    productNav?.classList.add("open");
    trigger?.setAttribute("aria-expanded","true");
  }
  function closeProducts(){
    productNav?.classList.remove("open");
    trigger?.setAttribute("aria-expanded","false");
  }
  trigger?.addEventListener("click",(e)=>{
    e.stopPropagation();
    productNav.classList.contains("open")?closeProducts():openProducts();
  });

  // Desktop hover with a small grace period, plus keyboard/click support.
  let leaveTimer;
  productNav?.addEventListener("mouseenter",()=>{if(window.innerWidth>960){clearTimeout(leaveTimer);openProducts()}});
  productNav?.addEventListener("mouseleave",()=>{if(window.innerWidth>960){leaveTimer=setTimeout(closeProducts,120)}});
  document.addEventListener("click",e=>{if(productNav&&!productNav.contains(e.target)&&window.innerWidth>960)closeProducts()});
  window.addEventListener("resize",()=>{if(window.innerWidth>960){nav?.classList.remove("mobile-open");mobile?.classList.remove("open")}else{closeProducts()}});

  // Product category hover/focus switches the detail panel.
  const categories=[...document.querySelectorAll(".mega-category")];
  const details=[...document.querySelectorAll(".mega-detail")];
  function activateCategory(key){
    categories.forEach(c=>{const active=c.dataset.category===key;c.classList.toggle("active",active);c.setAttribute("aria-selected",String(active))});
    details.forEach(d=>d.classList.toggle("active",d.dataset.detail===key));
  }
  categories.forEach(c=>{
    c.addEventListener("mouseenter",()=>activateCategory(c.dataset.category));
    c.addEventListener("focusin",()=>activateCategory(c.dataset.category));
    const trigger=c.querySelector(".mega-category-trigger");
    trigger?.addEventListener("click",()=>activateCategory(c.dataset.category));
  });

  // Reveal-on-scroll.
  const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
});

// Reflecta hero image slider — automatic only.
(function(){
  const slider=document.querySelector('.hero-slider');
  if(!slider) return;
  const slides=[...slider.querySelectorAll('.hero-slide')];
  let current=0;
  function show(i){
    current=(i+slides.length)%slides.length;
    slides.forEach((el,n)=>el.classList.toggle('active',n===current));
  }
  show(0);
  setInterval(()=>show(current+1),3800);
})();
