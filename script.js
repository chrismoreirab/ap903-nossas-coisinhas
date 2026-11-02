const products=[
{id:'prato',name:'Prato de sobremesa',category:'Cozinha',kind:'either',art:'plate',color:'pink',options:[{name:'Oxford Unni Damas Off White',detail:'Jogo com 6 pratos de sobremesa, 20 cm',url:'https://www.mercadolivre.com.br/jogo-de-6-pratos-sobremesa-20-cm-oxford-unni-damas-off-white/p/MLB42518551'},{name:'Prato de cerâmica terracota',detail:'Modelo e link a definir'}]},
{id:'airfryer',name:'Air fryer',category:'Cozinha',kind:'either',art:'airfryer',color:'olive',options:[{name:'Air fryer',detail:'Modelo e link a definir'}]},
{id:'micro',name:'Micro-ondas',category:'Cozinha',kind:'either',art:'microwave',color:'clay',options:[{name:'Micro-ondas',detail:'Modelo e link a definir'}]},
{id:'pillow',name:'Pillow top',category:'Quarto',kind:'either',art:'pillow',color:'cream',options:[{name:'Pillow top para cama de casal',detail:'Medidas e link a definir'}]},
{id:'duvet',name:'Capa de edredom',category:'Quarto',kind:'either',art:'blanket',color:'olive',options:[{name:'Capa de edredom / duvet',detail:'Modelo e link a definir'}]},
{id:'copos',name:'Porta-copos',category:'Cozinha',kind:'either',art:'coasters',color:'clay',options:[{name:'Porta-copos',detail:'Modelo e link a definir'}]},
{id:'cadeiras',name:'Cadeiras',category:'Decoração',kind:'all',art:'chair',color:'pink',options:[{name:'Cadeira 1',detail:'Modelo e link a definir'},{name:'Cadeira 2',detail:'Modelo e link a definir'}]},
{id:'prensa',name:'Prensa francesa',category:'Cozinha',kind:'either',art:'press',color:'cream',options:[{name:'Prensa francesa',detail:'Modelo e link a definir'}]},
{id:'jarra',name:'Jarra',category:'Cozinha',kind:'either',art:'jug',color:'pink',options:[{name:'Jarra',detail:'Modelo e link a definir'}]},
{id:'mesinha',name:'Mesinha de apoio',category:'Decoração',kind:'either',art:'table',color:'olive',options:[{name:'Mesinha de apoio',detail:'Modelo e link a definir'}]},
{id:'luminaria',name:'Luminárias',category:'Decoração',kind:'all',art:'lamp',color:'clay',options:[{name:'Luminária de mesa',detail:'Modelo e link a definir'},{name:'Luminária de chão',detail:'Modelo e link a definir'}]},
{id:'toalheiro',name:'Toalheiro térmico',category:'Banheiro',kind:'either',art:'towel',color:'cream',options:[{name:'Toalheiro térmico',detail:'Modelo e link a definir'}]},
{id:'cortina',name:'Cortina',category:'Quarto',kind:'either',art:'curtain',color:'pink',options:[{name:'Cortina',detail:'Modelo e link a definir'}]},
{id:'pano',name:'Panos de prato',category:'Cozinha',kind:'either',art:'towel',color:'olive',options:[{name:'Panos de prato',detail:'Modelo e link a definir'}]},
{id:'azeite',name:'Porta-azeite e vinagre',category:'Cozinha',kind:'either',art:'bottles',color:'clay',options:[{name:'Conjunto porta-azeite e vinagre',detail:'Modelo e link a definir'}]},
{id:'sapateira',name:'Sapateira',category:'Quarto',kind:'either',art:'shelf',color:'cream',options:[{name:'Sapateira',detail:'Modelo e link a definir'}]}
];
// Ilustrações SVG desenhadas com caminhos levemente irregulares, sem bibliotecas externas.
const drawings={
plate:'<ellipse cx="100" cy="94" rx="73" ry="57"/><ellipse cx="100" cy="94" rx="58" ry="43"/><path d="M59 61l81 67M44 78l67 57M82 52l75 61M41 99l35 35M142 62l-80 63M158 79l-55 55M120 54l-76 57"/>',
airfryer:'<path d="M51 44q-4-10 9-12h81q11 0 11 13l-5 104q0 12-14 12H65q-12 0-12-12Z"/><rect x="64" y="76" width="74" height="54" rx="11"/><path d="M83 106h36M84 143h33"/><circle cx="100" cy="56" r="9"/>',
microwave:'<rect x="29" y="52" width="145" height="94" rx="10"/><path d="M42 64h97v70H42zM151 68v50"/><circle cx="158" cy="128" r="6"/><path d="M46 151v10M158 151v10M60 78q30-14 60 3"/>',
pillow:'<path d="M43 75q-12-21 8-27q50-11 98-1q22 4 14 25q-9 26 1 48q8 21-16 25q-49 11-99 0q-20-6-11-26q9-23 5-44Z"/><path d="M58 67q-7 31 0 60M143 66q7 30 0 62"/>',
blanket:'<path d="M42 42q58-9 116 0l13 103q-66 18-139 1Z"/><path d="M47 58q54-11 107-1M38 124q60 13 127 1M68 77l15 11-16 11M121 78l15 11-16 11"/>',
coasters:'<ellipse cx="91" cy="110" rx="58" ry="30"/><ellipse cx="110" cy="91" rx="58" ry="30"/><ellipse cx="100" cy="70" rx="58" ry="30"/><path d="M62 71q40-23 79 0M73 91q33-18 70 0"/>',
chair:'<path d="M64 46q35-17 72 0l-5 75H70Z"/><path d="M54 120q44 12 91 0l-4 15H59Z"/><path d="M65 135l-8 42M135 135l9 42M76 58q27-8 49 0"/>',
press:'<path d="M61 64h81l-10 99H72Z"/><path d="M142 78q41-7 34 25q-5 19-37 18M58 61h88M100 30v31M83 30h34M69 83h65M74 146h60"/><path d="M84 98q14 11 31 0"/>',
jug:'<path d="M61 50h70l-4 99q-28 18-61 0Z"/><path d="M130 67q39-8 40 27q0 31-41 31M60 50l-16-8 16-9M68 76q31 9 60 0M76 114q22 7 43 0"/>',
table:'<ellipse cx="100" cy="65" rx="69" ry="23"/><path d="M34 65v14q62 36 132 0V65M69 94l-9 72M132 95l10 71M60 165q40 13 82 0"/>',
lamp:'<path d="M100 31l-47 77q44 18 94 0Z"/><path d="M99 110v58M70 169h59M99 28v-9M58 112q42 18 85 0"/><path d="M72 91q25 12 53 0"/>',
towel:'<path d="M55 40h92v121H55Z"/><path d="M70 40v122M132 40v122M55 63q44 11 92 0M55 133q44 11 92 0"/>',
curtain:'<path d="M40 34h121M51 39v117q11-15 21 0q12-16 24 0q10-16 23 0q12-16 28 0V39"/><path d="M67 43q-15 51 0 96M96 43q-12 53 0 96M125 43q-13 53 0 96"/>',
bottles:'<path d="M52 61h32v92q-17 11-34 0V61ZM58 44h19v17H58ZM113 64h35v89q-17 11-35 0V64ZM119 45h23v19h-23Z"/><path d="M54 102h29M115 102h31M57 38h21M118 39h25"/>',
shelf:'<path d="M51 42h99v120H51Z"/><path d="M51 81h99M51 121h99M65 68q15-20 32 0h13q10-11 22 0M63 106q14-19 32 0h12q14-18 29 0M65 146q16-18 31 0h15q13-15 25 0"/>'};
function illustration(key){return `<svg viewBox="0 0 200 195" role="img" aria-label="Ilustração artesanal"><g fill="none" stroke="currentColor" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round">${drawings[key]||drawings.plate}</g><path d="M22 23 C25 23 26 27 27 30 L30 38 L39 39 C44 40 44 44 40 47 L33 52 L35 61 C36 66 32 68 28 65 L21 60 L13 65 C9 68 5 65 7 60 L9 52 L2 47 C-2 44 0 40 5 39 L14 38 L17 30 C18 27 19 23 22 23Z" fill="currentColor" opacity=".72"/><path d="M174 136 C177 136 178 139 179 142 L182 150 L191 151 C196 152 196 156 192 159 L185 164 L187 173 C188 178 184 180 180 177 L173 172 L165 177 C161 180 157 177 159 172 L161 164 L154 159 C150 156 152 152 157 151 L166 150 L169 142 C170 139 171 136 174 136Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round" opacity=".9"/></svg>`}
// A lista é renderizada independentemente do Firebase, inclusive ao abrir index.html.
let purchased={};
let activeCategory='Todos';
let currentUser=null;
let liveReady=false;
let connectionError='';
let workingKey=null;
let currentGiftId=null;
let backend=null;
const categories=['Todos','Cozinha','Quarto','Decoração','Banheiro'];
const giftKey=(p,i)=>`${p.id}-${i}`;
const isBought=(p,i)=>Boolean(purchased[giftKey(p,i)]);
const isOwner=(p,i)=>Boolean(currentUser && purchased[giftKey(p,i)]?.compradoPor===currentUser.uid);
function done(p){return p.kind==='either'?p.options.some((_,i)=>isBought(p,i)):p.options.every((_,i)=>isBought(p,i))}
function render(){
  document.querySelector('#filters').innerHTML=categories.map(c=>`<button class="filter ${activeCategory===c?'active':''}" data-filter="${c}">${c}</button>`).join('');
  document.querySelector('#cards').innerHTML=products.filter(p=>activeCategory==='Todos'||p.category===activeCategory).map(p=>`<button class="gift-card ${p.color} ${done(p)?'is-done':''}" data-id="${p.id}" aria-label="Ver opções de ${p.name}"><span class="card-top"><span>${p.category}</span><span>${done(p)?'✓ comprado':p.kind==='all'?p.options.filter((_,j)=>isBought(p,j)).length+'/'+p.options.length+' escolhidos':'ver opções ↗'}</span></span><span class="card-art">${illustration(p.art)}</span><span class="card-bottom"><span class="card-title">${p.name}</span><span class="card-arrow">↗</span></span></button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.filter;render()});
  document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openGift(b.dataset.id));
}
const dialog=document.querySelector('#giftDialog');
document.querySelector('#closeDialog').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
function statusText(){
  if(connectionError)return `A lista de presentes está visível, mas as marcações estão indisponíveis: ${connectionError}.`;
  if(!liveReady)return 'Conectando à lista compartilhada…';
  if(!currentUser)return 'Preparando sua identificação anônima…';
  return 'Lista sincronizada. Marque apenas depois de comprar. Você pode desfazer suas próprias marcações neste navegador.';
}
function openGift(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  currentGiftId=id;
  const count=p.options.filter((_,i)=>isBought(p,i)).length;
  document.querySelector('#dialogContent').innerHTML=`<div class="dialog-art">${illustration(p.art)}</div><h3 class="dialog-title">${p.name}</h3><p class="dialog-sub">${p.kind==='either'?'Basta escolher uma das opções. Quando uma for comprada, este presente estará completo.':'Cada opção é um presente independente. O grupo fica completo quando todas forem compradas.'}</p>${p.kind==='all'?`<div class="group-progress">${count} de ${p.options.length} comprados</div>`:''}<div class="options">${p.options.map((o,i)=>{
    const bought=isBought(p,i),owner=isOwner(p,i),otherTaken=p.kind==='either'&&done(p)&&!bought;
    const disabled=(!liveReady||!currentUser||Boolean(connectionError)||Boolean(workingKey)||otherTaken||(bought&&!owner));
    const label=bought?(owner?'↶ Desfazer compra':'✓ Comprado'):(otherTaken?'Indisponível':'Já comprei');
    return `<div class="option"><div><strong>${o.name}</strong><small>${o.detail}</small>${o.url?`<a href="${o.url}" target="_blank" rel="noopener noreferrer">Ver produto ↗</a>`:'<small>Link em breve</small>'}</div><button data-buy="${i}" ${disabled?'disabled':''}>${workingKey===giftKey(p,i)?'Aguarde…':label}</button></div>`;
  }).join('')}</div><p class="dialog-hint" role="status">${statusText()}</p>`;
  document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>toggleGift(p,Number(b.dataset.buy)));
  if(!dialog.open)dialog.showModal();
}
async function toggleGift(p,i){
  if(!backend||!currentUser||!liveReady||connectionError||workingKey)return;
  const key=giftKey(p,i),previous=purchased[key];
  if(previous&&!isOwner(p,i))return;
  if(!previous&&p.kind==='either'&&done(p))return;
  const message=previous?`Desfazer a marcação de “${p.options[i].name}”? O presente voltará a ficar disponível para todos.`:`Você já comprou “${p.options[i].name}”? Só confirme depois de finalizar a compra.`;
  if(!window.confirm(message))return;
  workingKey=key;openGift(p.id);
  try{await backend.toggle({p,i,previous,uid:currentUser.uid})}
  catch(err){console.error('Erro ao atualizar presente:',err);window.alert('Não foi possível atualizar o presente. Confira sua conexão e tente novamente.');}
  finally{workingKey=null;if(currentGiftId===p.id)openGift(p.id)}
}
function refresh(){render();if(dialog.open&&currentGiftId)openGift(currentGiftId)}
// A renderização acontece ANTES de qualquer importação ou conexão externa.
render();
if(location.protocol==='file:'){
  connectionError='para sincronizar as compras, publique o site ou abra-o por um servidor local (http://localhost)';
}else{
  import('./firebase-sync.js').then(mod=>mod.startFirebase({
    products,
    onPurchases(data){purchased=data;liveReady=true;connectionError='';refresh()},
    onUser(user){currentUser=user;refresh()},
    onError(message){connectionError=message;liveReady=false;refresh()}
  })).then(api=>{backend=api;refresh()}).catch(err=>{
    console.error('Firebase não carregou:',err);
    connectionError='não foi possível carregar o Firebase';refresh();
  });
}
