const fs = require('fs').promises;

class GestorArchivos {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async leerArchivo() {
    try {
      const datos = await fs.readFile(this.ruta, 'utf-8');
      return JSON.parse(datos);
    } catch (error) {
      return [];
    }
  }

  async escribirArchivo(datos) {
    await fs.writeFile(this.ruta, JSON.stringify(datos, null, 2));
  }
}

module.exports = GestorArchivos;
