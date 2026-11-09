'use strict';
const modal=document.querySelector('#sticker-dialog');
document.querySelectorAll('.sticker-card').forEach(card=>card.addEventListener('click',()=>{const picture=card.querySelector('img');document.querySelector('#sticker-dialog-image').src=picture.src;document.querySelector('#sticker-dialog-image').alt=picture.alt;document.querySelector('#sticker-dialog-title').textContent=card.dataset.caption;modal.showModal();}));
document.querySelector('#sticker-dialog-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
