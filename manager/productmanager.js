const fs = require('fs');

class ProductManager {
    constructor(filePath) {

        this.filePath = filePath;

        
    }


    getProducts() {


        if (!fs.existsSync(this.filePath)) return [];
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }




    addProduct(product) {
        const products = this.getProducts();



        products.push({ id: Date.now(), ...product });
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));



    }

    deleteProduct(productId) {



        let products = this.getProducts();
        products = products.filter(product => product.id !== productId);
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager;
