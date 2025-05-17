const firebaseConfig = {
  apiKey: "AIzaSyD9GGkvaGfBoUM1JMwf437LGPz3mYGgQIc",
  authDomain: "melisa-anilar.firebaseapp.com",
  projectId: "melisa-anilar",
  storageBucket: "melisa-anilar.firebasestorage.app",
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

function logout(){localStorage.clear();location='index.html';}

const greetEl=document.getElementById('greet');
if(greetEl){greetEl.textContent='Hoş geldin '+(localStorage.getItem('username')==='melisa'?'Melisa 💜':'Berat 💙');}

const saveBtn=document.getElementById('save');
if(saveBtn){
 saveBtn.addEventListener('click',async()=>{
  const text=document.getElementById('text').value.trim();
  const file=document.getElementById('photo').files[0];
  if(!text && !file){alert('Bir şey yaz veya foto ekle');return;}
  let url=null;
  if(file){
    const r=ref(storage,'images/'+Date.now()+'_'+file.name);
    const snap=await uploadBytes(r,file);
    url=await getDownloadURL(snap.ref);
  }
  await addDoc(memCol,{text,image:url,date:new Date().toISOString(),author:localStorage.getItem('username')});
  document.getElementById('text').value='';document.getElementById('photo').value='';
 });
}

const list=document.getElementById('list');
if(list){
  onSnapshot(query(memCol,orderBy('date','desc')),(snap)=>{
    list.innerHTML='';
    snap.forEach(docSnap=>{
      const d=docSnap.data();
      const div=document.createElement('div');div.className='memory-card';
      div.innerHTML=`<p><strong>${new Date(d.date).toLocaleString()}</strong> • 🖊️ ${d.author}</p>
        ${d.text?`<p>${d.text}</p>`:''}
        ${d.image?`<img src="${d.image}">`:''}
        <button class="btn small" onclick="location='detail.html?id=${docSnap.id}'">Detay</button>
        ${d.author===localStorage.getItem('username')?`<button class="btn small" onclick="del('${docSnap.id}')">Sil</button>`:''}`;
      list.appendChild(div);
    });
  });
}

window.del=async(id)=>{await deleteDoc(doc(db,'memories',id));}

const detailDiv=document.getElementById('detail');
if(detailDiv){
  const id=new URLSearchParams(location.search).get('id');
  if(id){
    getDoc(doc(db,'memories',id)).then(s=>{
      if(!s.exists()){detailDiv.innerHTML='<p>Bulunamadı</p>';return;}
      const d=s.data();
      detailDiv.innerHTML=`<div class="memory-card"><p><strong>${new Date(d.date).toLocaleString()}</strong> • 🖊️ ${d.author}</p>${d.text?`<p>${d.text}</p>`:''}${d.image?`<img src="${d.image}">`:''}</div>`;
    });
  }
}

const gallery=document.getElementById('gallery');
if(gallery){
  onSnapshot(memCol,(snap)=>{
    gallery.innerHTML='';
    snap.forEach(s=>{
      const d=s.data();if(d.image){const img=document.createElement('img');img.src=d.image;gallery.appendChild(img);}
    });
  });
}

const calDiv=document.getElementById('calendar');
if(calDiv){
  import('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js').then(()=>{
    const events=[];
    onSnapshot(memCol,(snap)=>{
      events.length=0;
      snap.forEach(s=>{const d=s.data();events.push({title:d.author, start:d.date});});
      const cal=new FullCalendar.Calendar(calDiv,{initialView:'dayGridMonth',events});
      cal.render();
    });
  });
}