fetch('http://localhost:3000/api/products/')
    .then(response => {return response.json();
     })
    .then(data => {
        console.log(data);
        cartPage(data);
    })
    .catch((error) => {
        console.log("Error");
    })


  //import array from localStorage 
let cartArray = JSON.parse(localStorage.getItem('cartArray'));
console.log(cartArray);

let totalQuantity = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice');
let articlesCount = 0;
let priceCount = 0;

let cartSection = document.getElementById('cart__items');

let cartArticle = document.createElement('article');
cartArticle.classList.add("cart__item");


let imgDiv = document.createElement('div');
imgDiv.classList.add("cart__item__img");
cartArticle.appendChild(imgDiv);

let itemImg = document.createElement('img');
imgDiv.appendChild(itemImg);

let itemContent = document.createElement('div');
itemContent.classList.add("cart__item__content");
cartArticle.appendChild(itemContent);

let itemContentDescription = document.createElement('div');
itemContentDescription.classList.add("cart__item__content__description");
itemContent.appendChild(itemContentDescription);

let itemName = document.createElement('h2');
itemContentDescription.appendChild(itemName);

let itemColor = document.createElement('p');
itemContentDescription.appendChild(itemColor);

let itemPrice = document.createElement('p');
itemContentDescription.appendChild(itemPrice);

let itemSettings = document.createElement('div');
itemContent.appendChild(itemSettings);

let itemSettingsQuantity = document.createElement('div');
itemSettings.appendChild(itemSettingsQuantity);

let quantity = document.createElement('p');
quantity.textContent = 'Qty'
itemSettingsQuantity.appendChild(quantity);

let quantityInput = document.createElement('input');
quantityInput.setAttribute('type', 'number');
quantityInput.setAttribute('name', 'itemQuantity');
quantityInput.setAttribute('min', '1');
quantityInput.setAttribute('max', '100');
quantityInput.setAttribute('value', 0);

quantityInput.classList.add('itemQuantity');
itemSettingsQuantity.appendChild(quantityInput);

let itemSettingsDelete = document.createElement('div');
itemSettingsDelete.classList.add("cart__item__content__settings__delete");
itemSettings.appendChild(itemSettingsDelete);

let itemDelete = document.createElement('p');
itemDelete.textContent = 'Delete';
itemDelete.classList.add("deleteItem");
itemSettingsDelete.appendChild(itemDelete);
////////////////
//builds the cart table using data from local storage and from API

function cartPage(products) {

  //cart table will be generated for each element in the cart

  for (let i = 0; i < cartArray.length; i++) {

    const idItem = cartArray[i].idProduct;      //using ID of each item in the loop to get data from API

    //FINDS PRODUCT WITH SAME ID IN API AND FROM THERE WE CAN GET  IMAGE, ALTTEXT, NAME AND PRICE
    const findItem = products.find(({_id})=>_id===idItem); 

    cartArticle.setAttribute('data-id', idItem);

    cartArticle.setAttribute('data-color',  cartArray[i].color);


    itemImg.setAttribute('src', findItem.imageUrl);           //image set from API

    itemName.textContent = findItem.name;                    //name set from API

    itemColor.textContent = cartArray[i].color;

    itemPrice.textContent = findItem.price;                      //price set from API

    quantityInput.setAttribute('value', cartArray[i].quantity);     //value comes from the quantity stored in localStorage


    cartSection.appendChild(cartArticle.cloneNode(true));



    articleQuantity = cartArray[i].quantity;                                      // COUNTING JUST
    articleTotalPrice = cartArray[i].quantity*findItem.price;       // FOR ELEMENT IN THE LOOP [i]

    articlesCount += articleQuantity;         // ADDS TO GET THE TOTAL NUMBER OF ARTICLES
    priceCount += articleTotalPrice;          // AND TOTAL PRICE

    totalQuantity.textContent = articlesCount;
    totalPrice.textContent = priceCount; 

  }; //end of FOR loop


  //MODIFIYING QUANTITIES IN THE CART AND SUBSEQUENTLY TOTAL PRICE
  let inputValues = document.getElementsByClassName('itemQuantity');
  totalQuantity.textContent = articlesCount;
  totalPrice.textContent = priceCount; 

  //EVENTLISTENER FOR CHANGES ON INPUT FIELDS OF QUANTITY
  for(let i=0; i<inputValues.length;i++){
    inputValues[i].addEventListener('change', () => {
      cartArray[i].quantity = parseInt(inputValues[i].value);
      console.log(cartArray);
      localStorage.setItem('cartArray', JSON.stringify(cartArray));
      newQntyPrice();      
    })
  }
  //CHANGES TOTAL QUANTITY AND PRICE WITH THE EVENT
  function newQntyPrice() {
    let sumArticles = 0;
    let sumPrices = 0;
    if(cartArray.length==0){
      totalQuantity.textContent = 0;
      totalPrice.textContent = 0;
    }
    for(let i=0; i<cartArray.length;i++){
      let idItem = cartArray[i].idProduct;
      sumArticles += cartArray[i].quantity;
      let findItem = products.find(({_id})=>_id===idItem);
      sumPrices += cartArray[i].quantity*parseInt(findItem.price);
      totalQuantity.textContent = sumArticles;
      totalPrice.textContent = sumPrices; 
    }

  }
  //EVENTLISTENER FOR DELETING ITEM IN CART

  let deleteItem = document.querySelectorAll('.deleteItem');
  deleteLength = deleteItem.length;
 
  let provisionalCartArray = [];
  for(let i=0; i<deleteLength; i++) {

    deleteItem[i].addEventListener('click', () => {
    const itemToDelete = deleteItem[i].closest('article');
    const idToDelete = itemToDelete.dataset.id;
    const colorToDelete = itemToDelete.dataset.color;
    itemToDelete.parentNode.removeChild(itemToDelete);

    for(let i=0; i<cartArray.length; i++){
      if(cartArray[i].idProduct != idToDelete) {
        provisionalCartArray.push(cartArray[i])
      } else {
          if(cartArray[i].color != colorToDelete) {
          provisionalCartArray.push(cartArray[i])
          } 
      }
    }

    cartArray = provisionalCartArray;
    localStorage.setItem('cartArray', JSON.stringify(cartArray));
    console.log(cartArray);
    provisionalCartArray = [];

    newQntyPrice(); 

    })//close eventListener

  }

}  //end of cartPage() function

const submit = document.getElementById('order');

submit.addEventListener('click', ($event) => {
$event.preventDefault();

const formInput = document.querySelector('.cart__order__form');

const contact ={
  firstName: formInput.firstName.value,
  lastName: formInput.lastName.value,
  address: formInput.address.value,
  city: formInput.city.value,
  email: formInput.email.value
};

let products = [];
for(let i=0; i<cartArray.length; i++) {
  products[i] = cartArray[i].idProduct;
}

let orderData = { contact, products}

fetch('http://localhost:3000/api/products/order', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData)

})
.then(response => {return response.json();
})
.then(data => {
  console.log(data.orderId);

  
 window.location.href = 'confirmation.html?id=' + data.orderId;

})
.catch((error) => {
  console.error('Error:', error);
});

})