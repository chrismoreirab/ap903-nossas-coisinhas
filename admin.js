import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, setPersistence, inMemoryPersistence, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, onSnapshot, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { products } from './admin-products.js?v=59';
const config={apiKey:'AIzaSyAgg0c6UVANqV16NA2nqsgqaTFxL_X1AC0',authDomain:'ap-903---nossas-coisinhas.firebaseapp.com',projectId:'ap-903---nossas-coisinhas',storageBucket:'ap-903---nossas-coisinhas.firebasestorage.app',messagingSenderId:'1090808233353',appId:'1:1090808233353:web:2c55008a9fb3b8cdebb558'};
// Named Firebase app + memory-only auth keep the public site's anonymous session untouched.
const app=initializeApp(config,'ap903-admin');
const auth=getAuth(app),db=getFirestore(app);
const loginPanel=document.querySelector('#loginPanel'),dashboard=document.querySelector('#dashboard'),form=document.querySelector('#loginForm'),message=document.querySelector('#loginMessage'),status=document.querySelector('#status'),list=document.querySelector('#giftList');
let currentUser=null,unsubscribe=null,purchased={},loaded=false,busy=false;
const key=(p,i)=>p.options[i].reservationKey||`${p.id}-${i}`;
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reservationDate=record=>{const stamp=record?.compradoEm;const date=stamp?.toDate?.()??(stamp?.seconds!=null?new Date(stamp.seconds*1000):null);return date&&Number.isFinite(date.getTime())?new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(date).replace(',',' às'):'horário não disponível';};
function showLogin(text=''){dashboard.hidden=true;loginPanel.hidden=false;message.textContent=text;}
function showDashboard(){loginPanel.hidden=true;dashboard.hidden=false;status.textContent='Sincronizando presentes…';}
function renderVisitors(items){
 const panel=document.querySelector('#visitorGroups');
 const reserved=items.filter(x=>purchased[x.id]);
 const byUid=new Map();
 for(const item of reserved){
  const record=purchased[item.id];
  // Um mesmo UID anônimo representa a mesma sessão de autenticação, não uma identidade comprovada.
  const uid=typeof record.compradoPor==='string'&&record.compradoPor?record.compradoPor:null;
  const groupKey=uid?`uid:${uid}`:`sem-uid:${item.id}`;
  if(!byUid.has(groupKey))byUid.set(groupKey,{uid,items:[],earliest:Infinity});
  const group=byUid.get(groupKey);
  group.items.push({item,record});
  const millis=record.compradoEm?.toMillis?.()??Infinity;
  group.earliest=Math.min(group.earliest,millis);
 }
 const groups=[...byUid.values()].sort((a,b)=>a.earliest-b.earliest||String(a.uid).localeCompare(String(b.uid)));
 let anonymous=0;
 panel.innerHTML=`<div class="visitors-heading"><div><span class="eyebrow">DETETIVES DO AP 903 👀</span><h3>Quem reservou o quê?</h3></div><span class="visitors-count">${groups.length} ${groups.length===1?'identificação':'identificações'}</span></div><p class="visitors-help">Presentes com o mesmo identificador do Firebase aparecem juntos. Isso sugere o mesmo navegador/sessão, mas não confirma quem é a pessoa. A cidade não fica registrada.</p>`+
 (groups.length?`<div class="visitors-grid">${groups.map(group=>{
   const named=group.items.find(x=>x.record.tipoIdentificacao==='nome'&&typeof x.record.nomePresenteador==='string'&&x.record.nomePresenteador.trim());
   const hasSurprise=group.items.some(x=>x.record.tipoIdentificacao==='surpresa');
   const label=named?named.record.nomePresenteador.trim():hasSurprise?'🎁 surpresa':`Anônimo #${String(++anonymous).padStart(2,'0')}`;
   const subtitle=named?'nome informado na reserva':hasSurprise?'preferiu não informar o nome':'nome não informado';
   return `<article class="visitor-card"><div class="visitor-top"><strong>${safe(label)}</strong><span>${group.items.length} ${group.items.length===1?'presente':'presentes'}</span></div><small>${safe(subtitle)}</small><ul>${group.items.map(({item,record})=>`<li><span>${safe(item.p.name)}${item.p.options.length>1?` · ${safe(item.option.name)}`:''}</span><small class="reservation-time">${safe(reservationDate(record))}</small>${record.tipoIdentificacao==='surpresa'&&named?'<small>🎁 surpresa</small>':''}</li>`).join('')}</ul></article>`;
 }).join('')}</div>`:'<p class="visitors-empty">Ainda não há presentes reservados.</p>');
}
function render(){
 const items=[...products].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'})).flatMap(p=>p.options.map((option,i)=>({p,option,i,id:key(p,i)})));
 const count=items.filter(x=>Boolean(purchased[x.id])).length;
 document.querySelector('#totalCount').textContent=items.length;
 document.querySelector('#boughtCount').textContent=count;
 document.querySelector('#availableCount').textContent=items.length-count;
 renderVisitors(items);
 const groups=[...new Set(products.map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 list.innerHTML=groups.map(category=>`<section><h3 class="category-title">${safe(category)}</h3>${items.filter(x=>x.p.category===category).map(({p,option,i,id})=>{
  const bought=Boolean(purchased[id]);
  const otherOptionBought=p.kind==='either'&&p.options.some((_,j)=>j!==i&&purchased[key(p,j)])||p.kind==='hybrid'&&(Boolean(purchased[key(p,0)])||Boolean(purchased[key(p,1)]&&purchased[key(p,2)]));
  const disabled=busy||!loaded||(!bought&&otherOptionBought);
  const record=purchased[id];
  const who=record?(record.tipoIdentificacao==='surpresa'?'🎁 surpresa':record.nomePresenteador?`por ${safe(record.nomePresenteador)}`:'nome não informado'):'';
  return `<div class="gift-row"><div class="gift-info"><strong>${safe(p.name)}</strong><small>${safe(option.name)}</small>${who?`<small class="gift-presenter">${who}</small>`:''}${record?`<small class="gift-reserved-at">${safe(reservationDate(record))}</small>`:''}<span class="tag ${bought?'bought':''}">${bought?'✓ reservado':otherOptionBought?'outra opção já reservada':'disponível'}</span></div><button type="button" data-gift="${safe(id)}" ${disabled?'disabled':''} class="${bought?'marked':''}">${bought?'↶ desmarcar':'✓ marcar'}</button></div>`;
 }).join('')}</section>`).join('');
 list.querySelectorAll('[data-gift]').forEach(button=>button.addEventListener('click',()=>toggle(button.dataset.gift)));
}
async function toggle(id){
 if(busy||!loaded||!currentUser)return;
 const match=products.flatMap(p=>p.options.map((_,i)=>({p,i,id:key(p,i)}))).find(x=>x.id===id);
 if(!match)return;
 const {p,i}=match,bought=Boolean(purchased[id]);
 if(!confirm(bought?`Desmarcar “${p.options[i].name}” e disponibilizar novamente?`:`Marcar “${p.options[i].name}” como reservado?`))return;
 busy=true;status.textContent='Salvando alteração…';render();
 try{
  await runTransaction(db,async tx=>{
   const grouped=p.kind==='either'||p.kind==='hybrid';
   const refs=grouped?p.options.map((_,j)=>doc(db,'presentes',key(p,j))):[doc(db,'presentes',id)];
   const snaps=[];for(const ref of refs)snaps.push(await tx.get(ref));
   const current=grouped?snaps[i]:snaps[0];
   if(bought){if(!current.exists())throw new Error('A reserva já foi desmarcada.');tx.delete(doc(db,'presentes',id));}
   else{
    if(current.exists())throw new Error('Este presente já foi reservado.');
    if(p.kind==='either'&&snaps.some(s=>s.exists()))throw new Error('Alternativa já reservada.');
    if(p.kind==='hybrid'&&(snaps[0].exists()||(snaps[1].exists()&&snaps[2].exists())))throw new Error('Grupo já completo.');
    tx.set(doc(db,'presentes',id),{comprado:true,compradoPor:currentUser.uid,compradoEm:serverTimestamp()});
   }
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
