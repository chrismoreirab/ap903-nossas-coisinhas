import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, setPersistence, inMemoryPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, onSnapshot, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { products } from './admin-products.js';
const config={apiKey:'AIzaSyAgg0c6UVANqV16NA2nqsgqaTFxL_X1AC0',authDomain:'ap-903---nossas-coisinhas.firebaseapp.com',projectId:'ap-903---nossas-coisinhas',storageBucket:'ap-903---nossas-coisinhas.firebasestorage.app',messagingSenderId:'1090808233353',appId:'1:1090808233353:web:2c55008a9fb3b8cdebb558'};
// Named Firebase app + memory-only auth keep the public site's anonymous session untouched.
const app=initializeApp(config,'ap903-admin');
const auth=getAuth(app),db=getFirestore(app);
const loginPanel=document.querySelector('#loginPanel'),dashboard=document.querySelector('#dashboard'),form=document.querySelector('#loginForm'),message=document.querySelector('#loginMessage'),status=document.querySelector('#status'),list=document.querySelector('#giftList');
let currentUser=null,unsubscribe=null,purchased={},loaded=false,busy=false;
const key=(p,i)=>`${p.id}-${i}`;
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showLogin(text=''){dashboard.hidden=true;loginPanel.hidden=false;message.textContent=text;}
function showDashboard(){loginPanel.hidden=true;dashboard.hidden=false;status.textContent='Sincronizando presentes…';}
function render(){
 const items=products.flatMap(p=>p.options.map((option,i)=>({p,option,i,id:key(p,i)})));
 const count=items.filter(x=>Boolean(purchased[x.id])).length;
 document.querySelector('#totalCount').textContent=items.length;
 document.querySelector('#boughtCount').textContent=count;
 document.querySelector('#availableCount').textContent=items.length-count;
 const groups=[...new Set(products.map(p=>p.category))];
 list.innerHTML=groups.map(category=>`<section><h3 class="category-title">${safe(category)}</h3>${items.filter(x=>x.p.category===category).map(({p,option,i,id})=>{
  const bought=Boolean(purchased[id]);
  const otherOptionBought=p.kind==='either'&&p.options.some((_,j)=>j!==i&&purchased[key(p,j)]);
  const disabled=busy||!loaded||(!bought&&otherOptionBought);
  return `<div class="gift-row"><div class="gift-info"><strong>${safe(p.name)}</strong><small>${safe(option.name)}</small><span class="tag ${bought?'bought':''}">${bought?'✓ comprado':otherOptionBought?'outra opção já comprada':'disponível'}</span></div><button type="button" data-gift="${safe(id)}" ${disabled?'disabled':''} class="${bought?'marked':''}">${bought?'↶ desmarcar':'✓ marcar'}</button></div>`;
 }).join('')}</section>`).join('');
 list.querySelectorAll('[data-gift]').forEach(button=>button.addEventListener('click',()=>toggle(button.dataset.gift)));
}
async function toggle(id){
 if(busy||!loaded||!currentUser)return;
 const match=products.flatMap(p=>p.options.map((_,i)=>({p,i,id:key(p,i)}))).find(x=>x.id===id);
 if(!match)return;
 const {p,i}=match,bought=Boolean(purchased[id]);
 if(!confirm(bought?`Desmarcar “${p.options[i].name}” e disponibilizar novamente?`:`Marcar “${p.options[i].name}” como comprado?`))return;
 busy=true;status.textContent='Salvando alteração…';render();
 try{
  await runTransaction(db,async tx=>{
   const refs=p.kind==='either'?p.options.map((_,j)=>doc(db,'presentes',key(p,j))):[doc(db,'presentes',id)];
   const snaps=[];for(const ref of refs)snaps.push(await tx.get(ref));
   const current=p.kind==='either'?snaps[i]:snaps[0];
   if(bought){if(!current.exists())throw new Error('A compra já foi desmarcada.');tx.delete(doc(db,'presentes',id));}
   else{if(snaps.some(s=>s.exists()))throw new Error('Este presente ou uma alternativa já foi comprado.');tx.set(doc(db,'presentes',id),{comprado:true,compradoPor:currentUser.uid,compradoEm:serverTimestamp()});}
  });
  status.textContent='Alteração salva!';
 }catch(err){console.error(err);status.textContent='Não foi possível salvar. Confira a conexão e tente novamente.';alert('Não foi possível atualizar o presente. Ele pode ter sido alterado por outra pessoa.');}
 finally{busy=false;render();}
}
form.addEventListener('submit',async e=>{
 e.preventDefault();message.textContent='Entrando…';document.querySelector('#loginButton').disabled=true;
 try{await setPersistence(auth,inMemoryPersistence);await signInWithEmailAndPassword(auth,document.querySelector('#email').value.trim(),document.querySelector('#password').value);document.querySelector('#password').value='';}
 catch(err){console.error(err);message.textContent='Não foi possível entrar. Confira o e-mail e a senha.';}
 finally{document.querySelector('#loginButton').disabled=false;}
});
document.querySelector('#logoutButton').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,async user=>{
 if(unsubscribe){unsubscribe();unsubscribe=null;}currentUser=null;loaded=false;purchased={};
 if(!user){showLogin();return;}
 try{
  const admin=await getDoc(doc(db,'admins',user.uid));
  if(auth.currentUser?.uid!==user.uid)return;
  if(!admin.exists()||admin.data().ativo!==true){await signOut(auth);showLogin('Esta conta não tem acesso ao painel.');return;}
  currentUser=user;showDashboard();
  unsubscribe=onSnapshot(collection(db,'presentes'),snapshot=>{
   purchased={};snapshot.forEach(d=>{purchased[d.id]=d.data();});loaded=true;status.textContent='Lista atualizada em tempo real.';render();
  },err=>{console.error(err);loaded=false;status.textContent='Não foi possível carregar a lista. Confira as permissões do Firestore.';render();});
 }catch(err){console.error(err);await signOut(auth);showLogin('Não foi possível verificar seu acesso. Tente novamente.');}
});
