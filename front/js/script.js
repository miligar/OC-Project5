//product data will be requested from backend
//once that data is received, a function 'createCards' will retrieve the info we need and build the cards
fetch('http://localhost:3000/api/products/')
    .then(response => {return response.json();
     })
    .then(data => {
        console.log(data);
        createCards(data);
    })
    .catch((error) => {
        console.log("Error from API");
    })


//Using data the function 'createCards' will access through a loop to all necessary product details to assemble the cards
function createCards(products) {

    const cardSection = document.getElementById('items');

    for(let i = 0; i < products.length; i++) {

        //'item' will have the individual product's info to build the card: image, title and description
        let item = document.createElement('article');

        const itemImg = document.createElement('img');
        itemImg.setAttribute('src', products[i].imageUrl);
        itemImg.alt = products[i].altTxt;

        const itemName = document.createElement('h3');
        itemName.classList.add('productName');
        itemName.textContent = products[i].name;

        const itemDescription = document.createElement('p');
        itemDescription.classList.add('productDescription');
        itemDescription.textContent = products[i].description;

        //Once all info needed has been assembled, it will be appended in order to create the content of the card
        item.appendChild(itemImg);        
        item.appendChild(itemName);
        item.appendChild(itemDescription);

        //Item will be appended to a parent link and the whole will be the card, and then cards appended to the section: <section class="items" id="items">
        const itemLink = document.createElement('a');
        itemLink.setAttribute('href', `product.html?id=${products[i]._id}`);
        itemLink.appendChild(item);
        cardSection.appendChild(itemLink);                
    }
};
 