const params = new URLSearchParams(window.location.search);
const idProduct = params.get('id');
console.log(idProduct);

fetch('http://localhost:3000/api/products/' + idProduct)
.then(response => {return response.json();
})
.then(data => {
   console.log(data);
   productDisplay(data);
})
.catch((error) => {console.log("Error");})

function productDisplay(product){

    const imgBox = document.querySelector('.item__img');
    const itemImg = document.createElement('img');
    itemImg.setAttribute('src', product.imageUrl);
    itemImg.alt = product.altTxt;
    imgBox.appendChild(itemImg);

    const priceBox = document.getElementById('price');
    const itemPrice = product.price;
    priceBox.textContent = itemPrice;

    const descriptionBox = document.getElementById('description');
    const itemDescription = product.description;
    descriptionBox.textContent = itemDescription;

    const colorBox = document.getElementById('colors');

    for (let color of product.colors) {
        const colorOption = document.createElement('option');
        colorOption.textContent = color;
        colorBox.appendChild(colorOption);
    }
    cartBuild();
}

//the cart can be made as an array containing three things: - the product ID, - the quantity , -color
//use LocalStorage to access this array from the product page
//When adding the same product to the cart (same ID and colour), increase the quantity of product in the array
function cartBuild () {

    const addButton = document.getElementById('addToCart');
    const productQuantity = document.getElementById('quantity');
    const color = document.getElementById('colors');

    let cartArray = [];

    addButton.addEventListener('click', () => {

        if(localStorage.getItem('cartArray')!==null){
          cartArray = JSON.parse(localStorage.getItem('cartArray'));
        }

        if (productQuantity.value>=1 && productQuantity.value <=100 && color.value){
            let  newItem = {
                idProduct: idProduct,
                quantity: parseInt(productQuantity.value),
                color: color.value
            };
            let idToLook = newItem.idProduct;
            let findItem = cartArray.find((o, idToLook) => {
                if (o.color === newItem.color) {
                    o.quantity =  o.quantity + newItem.quantity;
                    return true;
                } 
            });
            if (!findItem){
                cartArray.push(newItem);
            }
            productQuantity.value=0;
            localStorage.setItem('cartArray', JSON.stringify(cartArray));

            console.log(cartArray);
            console.log(localStorage.getItem('cartArray'));
        };
    });
}