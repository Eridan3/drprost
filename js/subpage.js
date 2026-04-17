(function(){
function safe(name,fn){try{fn()}catch(e){console.warn('['+name+']',e)}}
safe('nav',function(){
  var btn=document.getElementById('hamBtn'),nav=document.getElementById('mainNav'),h=document.getElementById('siteHeader');
  if(btn&&nav){btn.addEventListener('click',function(){btn.classList.toggle('active');nav.classList.toggle('active');document.body.style.overflow=nav.classList.contains('active')?'hidden':''});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){btn.classList.remove('active');nav.classList.remove('active');document.body.style.overflow=''})});}
  if(h){window.addEventListener('scroll',function(){h.classList.toggle('scrolled',window.scrollY>20)})}
});
window.openOrderModal=function(){var m=document.getElementById('orderModal');if(m){m.classList.add('active');document.body.style.overflow='hidden'}};
window.closeOrderModal=function(){var m=document.getElementById('orderModal');if(m){m.classList.remove('active');document.body.style.overflow=''}};
safe('modalDismiss',function(){var m=document.getElementById('orderModal');if(m){m.addEventListener('click',function(e){if(e.target===m)closeOrderModal()});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeOrderModal()})}});
safe('forms',function(){
  ['order-form-modal','order-form-hero','order-form-final'].forEach(function(id){
    var f=document.getElementById(id);if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var name=f.querySelector('[name="name"]').value.trim();
      var phone=f.querySelector('[name="phone"]').value.replace(/[^\d]/g,'');
      var sub1=f.querySelector('[name="sub1"]');
      f.classList.add('form-submitting');
      fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,phone:phone,sub1:sub1?sub1.value:'',sub2:'drprost',sub3:'TR'})})
      .then(function(r){return r.json()}).then(function(){f.classList.remove('form-submitting');f.classList.add('form-success');setTimeout(function(){window.location.href='/tesekkurler/'},800)})
      .catch(function(){f.classList.remove('form-submitting');f.classList.add('form-success');setTimeout(function(){window.location.href='/tesekkurler/'},800)});
    });
  });
});
safe('faq',function(){
  document.querySelectorAll('.faq-item').forEach(function(it){
    var q=it.querySelector('.faq-q');if(!q)return;
    q.addEventListener('click',function(){
      var exp=it.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.faq-item').forEach(function(o){o.setAttribute('aria-expanded','false')});
      it.setAttribute('aria-expanded',exp?'false':'true');
    });
  });
});
safe('autopop',function(){
  if(location.pathname==='/tesekkurler/'||location.pathname==='/404.html')return;
  if(sessionStorage.getItem('drp_pop2'))return;
  if(!sessionStorage.getItem('drp_pop1')){setTimeout(function(){openOrderModal();sessionStorage.setItem('drp_pop1','1')},45000)}
  setTimeout(function(){openOrderModal();sessionStorage.setItem('drp_pop2','1')},120000);
});
})();
