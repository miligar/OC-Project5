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

//builds the cart table using data from local storage and from API

function cartPage(products) {

//import array from localStorage 

    const cartArray = JSON.parse(localStorage.getItem('cartArray'));
    console.log(cartArray);

    //cart table will be generated for each element in the cart

    for (let i = 0; i < cartArray.length; i++) {

        const idItem = cartArray[i].idProduct;      //using ID of each item in the loop to get data from API

        const cartSection = document.getElementById('cart__items');

        const cartArticle = document.createElement('article');
        cartArticle.classList.add("cart__item")

        const imgDiv = document.createElement('div');
        imgDiv.classList.add("cart__item__img");
        cartArticle.appendChild(imgDiv);

        const itemImg = document.createElement('img');                  

        for (let i=0; i<products.length; i++){                                       //                               
            if (products[i]._id===idItem){                                             //      FINDS PRODUCT WITH       
                itemImg.setAttribute('src', products[i].imageUrl);      //      SAME ID IN API                                       
                itemImg.alt = products[i].altTxt;                                   //       AND GETS THE IMAGE AND ALT                        
            }                                                                                             //                                        
        };                                                                                                                                                              

        imgDiv.appendChild(itemImg);

        const itemContent = document.createElement('div');
        itemContent.classList.add("cart__item__content");
        cartArticle.appendChild(itemContent);

        const itemContentDescription = document.createElement('div');
        itemContentDescription.classList.add("cart__item__content__description");
        itemContent.appendChild(itemContentDescription);

        const itemName = document.createElement('h2');
        for (let i=0; i<products.length; i++){
            if (products[i]._id===idItem){
                itemName.textContent = products[i].name;
            }
        };
 
        itemContentDescription.appendChild(itemName);

        const itemColor = document.createElement('p');
        itemColor.textContent = cartArray[i].color;
        itemContentDescription.appendChild(itemColor);

        const itemPrice = document.createElement('p');

        for (let i=0; i<products.length; i++){                              //
            if (products[i]._id===idItem){                                    //          
                itemPrice.textContent = products[i].price;         //            GETS THE PRICE FROM API
            }                                                                                    //
        };                                                                                       //

        itemContentDescription.appendChild(itemPrice);

        const itemSettings = document.createElement('div');
        itemContent.appendChild(itemSettings);

        const itemSettingsQuantity = document.createElement('div');
        itemSettings.appendChild(itemSettingsQuantity);

        const quantity = document.createElement('p');
        quantity.textContent = 'Qty'
        itemSettingsQuantity.appendChild(quantity);

        const quantityInput = document.createElement('input');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('name', 'itemQuantity');
        quantityInput.setAttribute('min', '1');
        quantityInput.setAttribute('max', '100');
        quantityInput.setAttribute('value', cartArray[i].quantity);
        quantityInput.classList.add('itemQuantity');
        itemSettingsQuantity.appendChild(quantityInput);

        const itemSettingsDelete = document.createElement('div');
        itemSettingsDelete.classList.add("cart__item__content__settings__delete");
        itemSettings.appendChild(itemSettingsDelete);

        const itemDelete = document.createElement('p');
        itemDelete.textContent = 'Delete';
        itemDelete.classList.add("deleteItem");
        itemSettingsDelete.appendChild(itemDelete);

        cartSection.appendChild(cartArticle)

    };

}

/*
<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
<div class="cart__item__img">
  <img src="../images/product01.jpg" alt="Photo of a sofa">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>Name of the product</h2>
    <p>Green</p>
    <p>€42.00</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Delete</p>
    </div>
  </div>
</div>
</article>
*/