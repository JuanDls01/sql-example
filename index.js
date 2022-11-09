const Product = require("./models/product");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/product", async (req, res) => {
  const products = await Product.findAll();
  res.status(200).json(products);
});

app.post("/product", async (req, res) => {
  const { name, brand, price } = req.body;
  try {
    if (!name || !brand || !price)
      throw new Error("Por favor provea todos los datos del productos");
    const [product, created] = await Product.findOrCreate({
      where: { name: name },
      defaults: {
        brand: brand,
        price: price,
      },
    });
    if (!created) throw new Error("El producto suministrado ya existe");
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("Por favor provea un producto para eliminar");
    const productToDelete = await Product.findByPk(id);
    if (productToDelete === null) {
      throw new Error("Producto no encontrado");
    } else {
      await productToDelete.destroy();
      res.status(200).json({
        message: `Producto ${productToDelete.dataValues.name} eliminado correctamente`,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/product", async (req, res) => {
  const { id, name, brand, price } = req.body;
  try {
    if (!name && !brand && !price)
      throw new Error("Por favor provea algún parametro para modificar");
    const productToUpdate = await Product.findByPk(id);
    if (productToUpdate === null) {
      throw new Error("Producto no encontrado");
    } else {
      if (name) await productToUpdate.update({ name: name });
      if (brand) await productToUpdate.update({ brand: brand });
      if (price) await productToUpdate.update({ price: price });
      await productToUpdate.save();
      res.status(200).json({
        message: `Producto ${productToUpdate.name} actualizado correctamente`,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(3001, () => {
  return console.log(`Server running on PORT 3001`);
});
