const firebaseConfig = {
  apiKey: "AIzaSyD9GGkvaGfBoUM1JMwf437LGPz3mYGgQIc",
  authDomain: "melisa-anilar.firebaseapp.com",
  projectId: "melisa-anilar",
  storageBucket: "melisa-anilar.appspot.com",
  messagingSenderId: "607534934654",
  appId: "1:607534934654:web:66a4d2f5a5418d314bc62f"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const memCol = collection(db,'memories');

window.logout = function() {localStorage.clear();location='index.html';}

const greet=document.getElementById('greet');
if(greet){greet.textContent='Hoş geldin '+(localStorage.getItem('username')==='melisa'?'Melisa 💜':'Berat 💙');}

const save=document.getElementById('save');
if(save){
 save.addEventListener('click',async()=>{
  const txt=document.getElementById('text').value.trim();
  const file=document.getElementById('photo').files[0];
  if(!txt && !file){alert('Bir şey yaz veya foto ekle');return;}
  let url=null;
  if(file){
    const r=ref(storage,'images/'+Date.now()+'_'+file.name);
    const snap=await uploadBytes(r,file);
    url=await getDownloadURL(snap.ref);
  }
  await addDoc(memCol,{text:txt,image:url,date:Date.now(),author:localStorage.getItem('username')});
  document.getElementById('text').value='';document.getElementById('photo').value='';
 });
}

const list=document.getElementById('list');
if(list){
 onSnapshot(query(memCol,orderBy('date','desc')),(snap)=>{
   list.innerHTML='';
   snap.forEach(d=>{
     const m=d.data();
     const div=document.createElement('div');div.className='memory-card';
     div.innerHTML=`<p><strong>${new Date(m.date).toLocaleString()}</strong> • 🖊️ ${m.author}</p>
       ${m.text?'<p>'+m.text+'</p>':''}
       ${m.image?'<img src="'+m.image+'">':''}
       <button class="btn small" onclick="location='detail.html?id=${d.id}'">Detay</button>
       ${m.author===localStorage.getItem('username')?'<button class="btn small" onclick="del(\''+d.id+'\')">Sil</button>':''}`;
     list.appendChild(div);
   });
 });
}

window.del=async(id)=>{await deleteDoc(doc(db,'memories',id));}

const detailDiv=document.getElementById('detail');
if(detailDiv){
 const id=new URLSearchParams(location.search).get('id');
 if(id){
   const s=await getDoc(doc(db,'memories',id));
   if(s.exists()){
     const m=s.data();
     detailDiv.innerHTML=`<div class="memory-card"><p><strong>${new Date(m.date).toLocaleString()}</strong> • 🖊️ ${m.author}</p>${m.text?'<p>'+m.text+'</p>':''}${m.image?'<img src="'+m.image+'">':''}</div>`;
   }
 }
}

const gallery=document.getElementById('gallery');
if(gallery){
 onSnapshot(memCol,s=>{
   gallery.innerHTML='';
   s.forEach(d=>{const m=d.data();if(m.image){const img=document.createElement('img');img.src=m.image;gallery.appendChild(img);}});
 });
}

const cal=document.getElementById('calendar');
if(cal){
 import('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js').then(()=>{
   const events=[];
   onSnapshot(memCol,s=>{events.length=0;s.forEach(d=>events.push({title:d.data().author,start:new Date(d.data().date)}));const c=new FullCalendar.Calendar(cal,{initialView:'dayGridMonth',events});c.render();});
 });
}

// ----- Music Player -----
let ytPlayer, playing=false;
function onYouTubeIframeAPIReady(){
  ytPlayer=new YT.Player('player',{height:'0',width:'0',videoId:'9ffDIG4PGh8',playerVars:{'playsinline':1},events:{'onReady':(e)=>{}}});
}
window.onYouTubeIframeAPIReady=onYouTubeIframeAPIReady;

const musicBtn=document.getElementById('musicBtn');
if(musicBtn){
 musicBtn.addEventListener('click',()=>{
  if(!ytPlayer) return;
  playing=!playing;
  if(playing){ytPlayer.playVideo();musicBtn.textContent='⏸';}
  else{ytPlayer.pauseVideo();musicBtn.textContent='♫';}
 });
}