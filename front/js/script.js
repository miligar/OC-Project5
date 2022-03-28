

fetch('http://localhost:3000/api/products/')
    .then(response => response.json() )
    .then(data => {
        console.log(data);
        createCards(data);
    })
    .catch(error => console.log(error))



function createCards(products) {

    const cardSection = document.getElementById('items');

    for(let i = 0; i < products.length; i++) {
        let item = document.createElement('article');
        const itemImg = document.createElement('img');
        itemImg.setAttribute('src', products[i].imageUrl);
        itemImg.atl = products[i].altTxt;

        const itemName = document.createElement('h3');
        itemName.classList.add('productName');
        itemName.textContent = products[i].name;

        const itemDescription = document.createElement('p');
        itemDescription.classList.add('productDescription');
        itemDescription.textContent = products[i].description;

        item.appendChild(itemImg);        
        item.appendChild(itemName);
        item.appendChild(itemDescription);

        const itemLink = document.createElement('a');
        itemLink.setAttribute('href', `product.html?id=${products[i]._id}`);

        itemLink.appendChild(item);
        cardSection.appendChild(itemLink);                
    }
};
 