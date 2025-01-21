const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const ProductManager = require('./manager/productManager');

const app = express();
const PORT = 5000;
const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const io = new Server(httpServer);
io.on('connection', (socket) => {
    console.log('Cliente conectado');

   



    socket.emit('updateProducts', productManager.getProducts());




    socket.on('addProduct', (newProduct) => {
        productManager.addProduct(newProduct);
        io.emit('updateProducts', productManager.getProducts());
    });

    socket.on('deleteProduct', (productId) => {




        productManager.deleteProduct(productId);
        io.emit('updateProducts', productManager.getProducts());
    });
});







const productManager = new ProductManager(path.join(__dirname, 'productos.json'));

app.get('/', (req, res) => {
    res.render('home', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');



    
});
