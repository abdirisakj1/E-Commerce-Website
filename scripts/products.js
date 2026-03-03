const productGrid = document.querySelector(".products"); 
const cart = document.querySelector(".btn-cart");
const cartIcon = document.querySelector(".cart");
const modal = document.querySelector(".modal");
const closeModalIcon = document.querySelector("#close-modal");
const productList = document.querySelector(".products-list");
const cartQuantity = document.querySelector(".cart-quantity");
const empty = document.querySelector(".cart-empty");
const amount = document.querySelector(".amount");

document.addEventListener("DOMContentLoaded", () => {
  LoadProduct();
});

function LoadProduct() {
  cartItems = getProductFromLocalStorage();

  cartItems.forEach((product) => {
    displayProductToCart(product);
  });

  checkCart();
  totalAmount();
}

// events
cartIcon.addEventListener("click", openModal);
closeModalIcon.addEventListener("click", closeModal);

// open modal
function openModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "flex";
}

// close modal
function closeModal() {
  modal.style.display = "none";
}

document.addEventListener("click", function(e) {
   if(e.target === modal){
    closeModal()
   }
})

// fetch data
async function fetchUtisilData() {
  const url = "https://dummyjson.com/products/category/kitchen-accessories";
  try {
    const responnse = await fetch(url);
    const data = await responnse.json();
    displayToDom(data.products);
  } catch (error) {
    console.log(error);
  }
}
fetchUtisilData();

// cartItems
let cartItems = [];

function checkCart() {
  cartQuantity.textContent = cartItems.length;

  if (cartItems.length === 0) {
    amount.style.display = "none";
    empty.style.display = "flex";
  } else {
    empty.style.display = "none";
    amount.style.display = "block";
  }
}

// displaying product
function displayToDom(products) {
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList = "product-card";
    productItem.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <p class="discount">   
                ${product.discountPercentage}% <br> 
                <span>OFF</span>
                </p>
                <h3>${product.title}</h3>
                <p class="desc">${product.description}...</p>
                <p class="price">$${product.price}</p>
                <button class="btn-cart">Add To Cart</button>
        `;
    productGrid.appendChild(productItem);
    const cartBtn = productItem.querySelector(".btn-cart");
    cartBtn.addEventListener("click", () => {
      addTocart(product);
    });
  });
}

// btns in cart handling
function eventhandleBtns(product, productItem) {
  const removeBtn = productItem.querySelector(".remove");
  const addQuantityBtn = productItem.querySelector(".plus");
  const decreaseQuantityBtn = productItem.querySelector(".minus");
  
  decreaseQuantityBtn.addEventListener("click", function () {
    decreaseQuantity(product, productItem);
  });
  
  addQuantityBtn.addEventListener("click", function () {
    updateQuantity(product, productItem);
  });
  
  removeBtn.addEventListener("click", function () {
    removeProductFromCart(product, productItem);
  });
}

// decrease quantity
function decreaseQuantity(product, productItem) {
  let quantityEl = productItem.querySelector(".quanity");
  let priceEl = productItem.querySelector(".price");

  let quantity = Number(quantityEl.textContent);

  quantity--;

  if (quantity < 1) {
    removeProductFromCart(product, productItem);
    return;
  }

  product.quantity = quantity;

  quantityEl.textContent = quantity;

  const updatedPrice = product.price * quantity;

  priceEl.textContent = `$${updatedPrice.toFixed(2)}`;
  
  saveCart();
  totalAmount();
}

// update quantity
function updateQuantity(product, productItem) {
  let quantityEl = productItem.querySelector(".quanity");
  let priceEl = productItem.querySelector(".price");

  let quantity = Number(quantityEl.textContent);

  quantity++;

  product.quantity = quantity;

  quantityEl.textContent = quantity;

  const newPrice = product.price * quantity;

  priceEl.textContent = `$${newPrice.toFixed(2)}`;
  
  saveCart();
  totalAmount();
}

// remove product from cart
function removeProductFromCart(product, productItem) {
  // removing product
  cartItems = cartItems.filter((item) => item.id !== product.id);
  productItem.remove();
  saveCart();
  
  // update quantity
  cartQuantity.textContent = cartItems.length;

  // update total
  totalAmount();
  checkCart();
}

// add to cart btn
function addTocart(product) {
  const isExist = cartItems.find((item) => item.id === product.id);

  if (isExist) {
    alert("product already in cart!");
    return;
  }

  const newProduct = {
    ...product,
    quantity: 1
  };

  cartItems.push(newProduct);

  saveCart();
  displayProductToCart(newProduct);
  checkCart();
  totalAmount();
}

// total amount
function totalAmount() {
  let total = 0;

  cartItems.forEach((product) => {
    total += product.price * product.quantity;
  });

  document.querySelector(".amount").textContent =
    `Total Amount: $${total.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("products", JSON.stringify(cartItems));
}

function getProductFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("products")) || [];
  return data;
}

// display product to cart
function displayProductToCart(product) {
  const productItem = document.createElement("div");
  productItem.classList.add("card");
  
  productItem.innerHTML = `
      <div class="product-info">
         <img src="${product.thumbnail}" alt="product-img">
         <div class="product-title">
            <h1>${product.title}</h1>
            <p class="desc">${product.description}</p>

            <div class="quantity-price">
                <p class="price">$${product.price}</p>
                <p class="quanity">${product.quantity}</p>
            </div>

            <div class="btns">
                <div class="update">
                    <button class="plus">+</button>
                    <button class="minus">-</button>
                </div>
                <div class="delete">
                    <button class="remove">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
         </div>
      </div>
    `;

  productList.appendChild(productItem);
  eventhandleBtns(product, productItem);
}