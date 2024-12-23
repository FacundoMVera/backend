const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando!');
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
