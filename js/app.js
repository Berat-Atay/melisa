
function checkAuth(){if(localStorage.getItem('loggedIn')!=='true') window.location='index.html';}
function logout(){localStorage.removeItem('loggedIn');window.location='index.html';}

function saveMemory(){
 const txt=document.getElementById('memoryText').value.trim();
 const fileInput=document.getElementById('photoInput');
 const file=fileInput?fileInput.files[0]:null;
 if(!txt && !file){toast('Bir şey yaz veya fotoğraf ekle!');return;}
 const reader=new FileReader();
 reader.onloadend=function(){
   const img=file?reader.result:null;
   const mem={text:txt,image:img,date:new Date().toLocaleString()};
   const arr=JSON.parse(localStorage.getItem('memories')||'[]');arr.push(mem);
   localStorage.setItem('memories',JSON.stringify(arr));
   if(document.getElementById('memoryText'))document.getElementById('memoryText').value='';
   if(fileInput)fileInput.value='';
   renderMemories();renderGallery();confetti();toast('Kaydedildi!');
 };
 if(file){reader.readAsDataURL(file);}else{reader.onloadend();}
}

function renderMemories(){
 const c=document.getElementById('memoriesContainer');if(!c)return;
 c.innerHTML='';
 const mems=(JSON.parse(localStorage.getItem('memories')||'[]')).reverse();
 mems.forEach((m,i)=>{
  const index=mems.length-1-i;
  const div=document.createElement('div');div.className='memory-card';
  div.innerHTML=`<p><strong>${m.date}</strong></p>
  <button class="btn small" onclick="goDetail(${index})">Detay</button>
  <button class="btn small" onclick="del(${index})">Sil</button>`;
  c.appendChild(div);
 });
}

function goDetail(id){window.location='detail.html?id='+id;}
function del(id){const a=JSON.parse(localStorage.getItem('memories')||'[]');a.splice(id,1);localStorage.setItem('memories',JSON.stringify(a));renderMemories();renderGallery();}
function renderDetail(){
 const c=document.getElementById('detailContainer');if(!c)return;
 const id=new URLSearchParams(location.search).get('id');if(id===null)return;
 const m=JSON.parse(localStorage.getItem('memories')||'[]')[id];
 if(!m){c.innerHTML='<p>Bulunamadı</p>';return;}
 const div=document.createElement('div');div.className='memory-card';
 div.innerHTML=`<p><strong>${m.date}</strong></p>${m.text?'<p>'+m.text+'</p>':''}${m.image?'<img src="'+m.image+'">':''}`;
 c.appendChild(div);
}
function renderGallery(){
 const c=document.getElementById('galleryContainer');if(!c)return;
 c.innerHTML='';
 JSON.parse(localStorage.getItem('memories')||'[]').forEach(m=>{if(m.image){const img=document.createElement('img');img.src=m.image;c.appendChild(img);}});
}

function toast(msg){
 const t=document.createElement('div');t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#000a;color:#fff;padding:8px 16px;border-radius:20px;z-index:99;';
 t.innerText=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2000);
}

function themeToggle(){
 document.body.classList.toggle('darkmode');
 localStorage.setItem('dark',document.body.classList.contains('darkmode'));
 document.querySelectorAll('#themeToggle').forEach(i=>i.textContent=document.body.classList.contains('darkmode')?'light_mode':'dark_mode');
}
function applyTheme(){if(localStorage.getItem('dark')==='true') document.body.classList.add('darkmode');}

function confetti(){
 const e=document.createElement('div');e.style.cssText='position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:98;';
 for(let i=0;i<100;i++){
   const p=document.createElement('div');p.style.cssText=`position:absolute;width:6px;height:6px;background:hsl(${Math.random()*360},100%,60%);top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:0;animation:pop 700ms forwards ${Math.random()*300}ms ease-out`;
   e.appendChild(p);
 }
 document.body.appendChild(e);setTimeout(()=>e.remove(),1000);
}
const style=document.createElement('style');style.innerHTML='@keyframes pop{0%{transform:scale(0);opacity:1}80%{transform:translateY(-60vh) scale(1);opacity:1}100%{opacity:0}}';document.head.appendChild(style);

document.addEventListener('DOMContentLoaded',()=>{
 if(!location.pathname.endsWith('index.html')){checkAuth();applyTheme();}
 const s=document.getElementById('saveBtn');if(s)s.addEventListener('click',saveMemory);
 document.querySelectorAll('#themeToggle').forEach(el=>el.addEventListener('click',themeToggle));
 renderMemories();renderGallery();renderDetail();
 const music=document.getElementById('bgMusic');const mBtn=document.getElementById('musicBtn');if(mBtn){mBtn.addEventListener('click',()=>{if(music.paused){music.play();mBtn.firstElementChild.textContent='music_off';}else{music.pause();mBtn.firstElementChild.textContent='music_note';}});}
 const out=document.getElementById('logoutBtn');if(out)out.addEventListener('click',logout);
});
