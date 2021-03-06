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


////////////////////////////////////////////////////

let cartArray = JSON.parse(localStorage.getItem('cartArray'));
console.log(cartArray);

function cartEmpty(){
if(cartArray===null||cartArray.length===0){
  let message = document.querySelector('h1');
  message.textContent = 'Your cart is empty';
}
};
cartEmpty();


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

//////////////////////////////////////////////

//BUILDS THE TABLE OF PRODUCTS
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

    let quantities = document.getElementsByClassName('itemQuantity');
    quantities[i].addEventListener('change',  changeQuantity);       //event listener for changing quantities

    
    let deleteButton = document.getElementsByClassName('deleteItem');
    deleteButton[i].addEventListener('click', deleteItems);

    articleQuantity = cartArray[i].quantity;                                      // COUNTING JUST
    articleTotalPrice = cartArray[i].quantity*findItem.price;       // FOR ELEMENT IN THE LOOP [i]

    articlesCount += articleQuantity;         // ADDS TO GET THE TOTAL NUMBER OF ARTICLES
    priceCount += articleTotalPrice;          // AND TOTAL PRICE

  }; //end of FOR loop

  totalQuantity.textContent = articlesCount;
  totalPrice.textContent = priceCount; 

}  //end of cartPage() function

/////////////////////////////////////////////////////////////////////

//CHANGES QUANTITY OF AN ITEM WHEN NEW VALUE OR CLICK
function changeQuantity(event) {
  let articlesArray = Array.from( document.getElementById('cart__items').children );
  let articleEvent = event.target.closest('article');
  let eventIndex =articlesArray.indexOf(articleEvent);

  if(event.target.value!=0){
  cartArray[eventIndex].quantity = parseInt(event.target.value);
  } else { 
    cartArray[eventIndex].quantity =1;
    event.target.value = 1;
  }

  localStorage.setItem('cartArray', JSON.stringify(cartArray));
  newQntyPrice();
}

//FOR DELETING ITEM IN CART
function deleteItems(event){
  const itemToDelete = event.target.closest('article');
  const idToDelete = itemToDelete.dataset.id;
  const colorToDelete = itemToDelete.dataset.color;
  itemToDelete.parentNode.removeChild(itemToDelete);
  
  let provisionalCartArray = [];
  for(let i=0; i<cartArray.length; i++){
    if(cartArray[i].idProduct != idToDelete) {
      provisionalCartArray.push(cartArray[i]);
    } else {
        if(cartArray[i].color != colorToDelete) {
          provisionalCartArray.push(cartArray[i]);
        } 
      }
  }

  cartArray = provisionalCartArray;
  localStorage.setItem('cartArray', JSON.stringify(cartArray));
  provisionalCartArray = [];
  cartEmpty(); //if cart is empty a message will be displayed
  newQntyPrice();    
}
  
//CHANGES TOTAL QUANTITY AND PRICE WITH EVENTS
function newQntyPrice() {
  let sumArticles = 0;
  let sumPrices = 0;
  if(cartArray.length==0){
    totalQuantity.textContent = 0;
    totalPrice.textContent = 0;
  }
  for(let i=0; i<cartArray.length;i++){
    let idItem = cartArray[i].idProduct;
    fetch('http://localhost:3000/api/products/' + idItem)
    .then(response => {return response.json();
    })
    .then(data => {
    sumArticles += cartArray[i].quantity;
    sumPrices += cartArray[i].quantity*parseInt(data.price);
    totalQuantity.textContent = sumArticles;
    totalPrice.textContent = sumPrices; 
  })
}
  console.log(cartArray);
}


///////////////////////////////////////////////////////////////////
//VALIDATION OF INPUT FIELDS
const formInput = document.querySelector('.cart__order__form');

//REGULAR EXPRESION IN ORDER FOR THE INPUT FIELDS
let regArray = [/^[a-zA-Z '-]+$/, /^[a-zA-Z '-]+$/, /^[^- ][a-zA-Z '-????????????????????????????0-9]*[^- ]$/,/^[a-zA-Z '-]+$/, /\S+@\S+\.\S+/];

let formValidation = {
  firstNameValidation: false,
  lastNameValidation: false,
  addressValidation: false,
  cityValidation: false,
  emailValidation: false
}

for(let i=0; i<5; i++){
  formInput[i].value='';
}

for(let i=0; i<5; i++){
  formInput[i].addEventListener('change', function (){
    formValidation[Object.keys(formValidation)[i]] = validate(formInput[i], regArray[i]);
    console.log(formValidation);
  })
}

//WITH INPUT FROM THE FORM AND REGULAR EXPRESIONS, IT CHECKS VALIDITY
function validate(input, regex) {
    if(regex.test(input.value)) {
     input.style.border = 'thin solid green';
     input.nextElementSibling.textContent = '';
      return true
    } else {
      input.nextElementSibling.textContent = 'Invalid';
      input.style.border = 'thin solid red';
      return false
    }
}
//////////////////////////////////////

//SUBMIT EVENT
const submit = document.getElementById('order');

submit.addEventListener('click', ($event) => {
  $event.preventDefault();
  if(
    formValidation.firstNameValidation== true&&
    formValidation.lastNameValidation===true&&
    formValidation.addressValidation===true&&
    formValidation.cityValidation===true&&
    formValidation.emailValidation===true&&
    cartArray!=null&&
    cartArray.length!=0
  ){

    const formInput = document.querySelector('.cart__order__form');

    const contact ={
      firstName: formInput.firstName.value,
      lastName: formInput.lastName.value,
      address: formInput.address.value,
      city: formInput.city.value,
      email: formInput.email.value
    };

    const products = [];
    for(let i=0; i<cartArray.length; i++) {
      products[i] = cartArray[i].idProduct;
    }

    let orderData = {contact, products};


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

    } else {
        if(cartArray===null||cartArray.length===0){
          alert('Your cart is empty')
        } else {
            for(i=0; i<Object.keys(formValidation).length; i++) {
              if(formValidation[Object.keys(formValidation)[i]]===false){
                formInput[i].nextElementSibling.textContent = 'Invalid';
                formInput[i].style.border = 'thin solid red';
              }
            }
          }
    }
  
})
