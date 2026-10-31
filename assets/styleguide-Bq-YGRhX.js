import{A as e,C as t,O as n,a as r,d as i,l as a,o,p as s,s as c,t as l,y as u}from"./app-CwufxXzu.js";var d=e=>document.querySelector(e),f=document.createElement(`style`);f.textContent=`
  .sg { padding-top: 28px; }
  .sg__head { display: grid; gap: 10px; max-width: 70ch; margin-bottom: 24px; }
  .sg code { font-size: 0.9em; padding: 1px 6px; border-radius: 6px; background: rgba(30,24,25,.06); }
  .sg-sec { padding-block: 32px; border-top: 1px solid rgba(30,24,25,.08); }
  .sg-sec .section-title { margin-bottom: 20px; }
  .sg-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
  .sg-swatches figure { display: grid; gap: 8px; }
  .sg-swatches span { height: 72px; border-radius: 16px; background: var(--c); box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .sg-swatches figcaption { font-size: 12px; color: var(--text-muted); }
  .sg-swatches b { display: block; font-size: 13px; color: var(--text-strong); }
  .sg-type { display: grid; gap: 12px; padding: 28px; border-radius: var(--r-panel); }
  .sg-glass { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; padding: 28px; border-radius: var(--r-panel);
    background: linear-gradient(120deg, #FCE6E1, #EE6E6F 60%, #E30613), url(img/living-warm-sm.webp) center/cover; background-blend-mode: soft-light; }
  .sg-pane { display: grid; gap: 6px; min-height: 150px; align-content: end; padding: 20px; border-radius: 22px; font-size: 13px; }
  .sg-pane b { font-size: 16px; }
  .sg-shapes { display: flex; flex-wrap: wrap; gap: 14px; }
  .sg-shapes div { display: grid; place-items: center; width: 140px; height: 96px; background: #fff; box-shadow: var(--shadow-card); font-size: 13px; font-weight: 600; }
  .sg-space { display: flex; align-items: end; gap: 14px; margin-top: 20px; font-size: 12px; color: var(--text-muted); }
  .sg-space span { display: grid; justify-items: center; gap: 6px; }
  .sg-space span::before { content: ""; width: var(--w); height: var(--w); background: var(--brand-red); border-radius: 2px; }
  .sg-shadows { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; }
  .sg-shadows div { display: grid; place-items: center; width: 200px; height: 100px; border-radius: var(--r-card); background: #fff; font-size: 13px; font-weight: 600; }
  .sg-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
  .sg-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gutter); margin-bottom: 24px; }
  .sg-forms { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; align-items: start; padding: 28px; border-radius: var(--r-panel); }
  @media (max-width: 900px) { .sg-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`,document.head.appendChild(f),l(),d(`[data-sg-cards]`).innerHTML=[n(`hoggar-3`),n(`djurdjura-240`),n(`chenoua-armchair`)].map(e=>r(e)).join(``)+i(1),d(`[data-sg-tiles]`).innerHTML=u.slice(0,6).map(t=>`<li><a class="ctile" href="category.html?c=${t.id}"><span class="ctile__img"><img src="${t.img}" alt="" width="96" height="96" loading="lazy"></span><span>${e(t)}</span></a></li>`).join(``),d(`[data-sg-track]`).innerHTML=t.slice(0,8).map(e=>r(e)).join(``),o(d(`[data-carousel]`)),c(d(`[data-sg-countdown]`),a()),d(`[data-sg-toast]`).addEventListener(`click`,()=>s(`Added to your cart`,{href:`cart.html`,label:`View cart`}));