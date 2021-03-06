// Projeto feito com ajuda das colegas Heloísa Hackenhaar, Pollyana Oliveira
// Referencias: https://github.com/tryber/sd-010-a-project-shopping-cart/pull/50
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/26
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/81
// https://github.com/tryber/sd-010-a-project-shopping-cart/pull/88

const cartContainer = () => document.querySelector('.cart__items');

// requisito 5
const sumTotalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let sumTotal = 0;
  cartItem.forEach((item) => {
    const split = item.innerText.split('$')[1];
    sumTotal += parseFloat(split);
  });
  totalPrice.innerText = sumTotal;
};

// requisito 4
const saveCart = () => {
  const cartContent = cartContainer().innerHTML;
  localStorage.setItem('cart', cartContent);
};

const getCart = () => {
  localStorage.getItem('cart');
};

// requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumTotalPrice();
}

function loadCart() {
  const currentCart = localStorage.getItem('cart');
  const cartItems = cartContainer();
  cartItems.innerHTML = currentCart;
  cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart__item')) {
      cartItemClickListener(e);
    }
  });
  sumTotalPrice();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  // requisito 1
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// requisito 1 
const addProduct = (products) => {
  products.forEach((product) => {
    const { id, title, thumbnail } = product;
  createProductItemElement({ id, title, thumbnail });
  });
};

async function productList() {
  let products; 
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  response.json().then((data) => {
    products = data.results;
    addProduct(products);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2
const getItemId = () => {
  const cartItem = cartContainer();
  const buttons = document.querySelector('.items');
    buttons.addEventListener('click', async (e) => {
      const itemId = getSkuFromProductItem(e.target.parentElement);
      const getFetch = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      const itemData = await getFetch.json();
        const { id, title, price } = itemData;
        cartItem.appendChild(createCartItemElement({ id, title, price }));
        saveCart();
        sumTotalPrice();
      });
};

function emptyCart() {
  const cartContent = document.querySelectorAll('.cart__item');
  cartContent.forEach((product) => product.remove());
  saveCart();
  sumTotalPrice();
}

function clearButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
}

window.onload = function onload() {
  loadCart();
  productList();
  getItemId();
  getCart();
  clearButton();
};
