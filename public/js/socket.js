const socket = io();


const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');


socket.on('updateProducts', (products) => {
    productList.innerHTML = '';
     
    products.forEach(product => {


        const li = document.createElement('li');


        li.textContent = `${product.name} - $${product.price}`;



        productList.appendChild(li);



    });
});


productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
    };

    socket.emit('addProduct', newProduct);
    productForm.reset();
});
