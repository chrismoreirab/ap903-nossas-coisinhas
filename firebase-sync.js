import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore, collection, doc, onSnapshot, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const firebaseConfig = {
  apiKey: 'AIzaSyAgg0c6UVANqV16NA2nqsgqaTFxL_X1AC0',
  authDomain: 'ap-903---nossas-coisinhas.firebaseapp.com',
  projectId: 'ap-903---nossas-coisinhas',
  storageBucket: 'ap-903---nossas-coisinhas.firebasestorage.app',
  messagingSenderId: '1090808233353',
  appId: '1:1090808233353:web:2c55008a9fb3b8cdebb558',
  measurementId: 'G-J1SETW623K'
};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
export async function startFirebase({products,onPurchases,onUser,onError}){
  const gifts=collection(db,'presentes');
  onSnapshot(gifts,snapshot=>{
    const purchased={};snapshot.forEach(item=>{purchased[item.id]=item.data()});
    onPurchases(purchased);
  },error=>{console.error('Erro ao sincronizar:',error);onError('falha de conexão ou permissão do Firestore')});
  onAuthStateChanged(auth,user=>{
    onUser(user);
    if(!user)signInAnonymously(auth).catch(error=>{
      console.error('Erro de autenticação:',error);onError('autenticação anônima indisponível');
    });
  },error=>{console.error('Auth:',error);onError('falha na autenticação')});
  return {
    async toggle({p,i,previous,uid}){
      const key=`${p.id}-${i}`;
      const ref=doc(db,'presentes',key);
      await runTransaction(db,async tx=>{
        // Para presentes alternativos, ler todas as opções antes de escrever.
        // Assim duas compras simultâneas não marcam alternativas distintas.
        const refs=p.kind==='either'?p.options.map((_,j)=>doc(db,'presentes',`${p.id}-${j}`)):[ref];
        const snapshots=[];
        for(const candidate of refs)snapshots.push(await tx.get(candidate));
        const current=snapshots[i] && p.kind==='either'?snapshots[i]:snapshots[0];
        if(previous){
          if(!current.exists()||current.data().compradoPor!==uid)throw new Error('Compra não pertence a esta identificação.');
          tx.delete(ref);
        }else{
          if(snapshots.some(s=>s.exists()))throw new Error('Presente já comprado.');
          tx.set(ref,{comprado:true,compradoPor:uid,compradoEm:serverTimestamp()});
        }
      });
    }
  };
}
