document.querySelectorAll('.accordion').forEach(btn=>{
 btn.addEventListener('click',()=>{
  const expanded=btn.getAttribute('aria-expanded')==='true';
  btn.setAttribute('aria-expanded',!expanded);
  btn.nextElementSibling.style.display=expanded?'none':'block';
 });
});
