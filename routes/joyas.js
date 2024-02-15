const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Ruta GET /joyas
router.get("/joyas", async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;
    if (limits <= 0 || page <= 0) {
      throw new Error("Valores de página o límite incorrectos");
    }
    const offset = (page - 1) * limits;
    const orderParams = order_by.split("_");
    if (
      orderParams.length !== 2 ||
      !["id", "nombre", "categoria", "metal", "precio", "stock"].includes(
        orderParams[0]
      ) ||
      !["ASC", "DESC"].includes(orderParams[1])
    ) {
      throw new Error("Parámetro order_by incorrecto");
      console.log(orderParams);
    }
    const orderByField = orderParams[0];
    const orderByDirection = orderParams[1];
    const query = {
      text: `
      SELECT *
      FROM inventario
      ORDER BY $1 ${orderByDirection}
      LIMIT $2 OFFSET $3;
    `,
      values: [orderByField, limits, offset],
    };
    const result = await pool.query(query);

    // Construir estructura HATEOAS
    const joyas = result.rows;
    const joyasWithLinks = joyas.map((joya) => {
      return {
        ...joya,
        links: [
          { rel: "self", href: `/joyas/${joya.id}` }, // HATEOAS
        ],
      };
    });

    // Lógica para generar estructura HATEOAS
    res.json({ data: joyasWithLinks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET /joyas/filtros que implementa filtrado por precio, categoría y metal
router.get("/joyas/filtros", async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query;
    const filters = [];
    const values = [];

    if (precio_max) {
      filters.push("precio <= $1");
      values.push(precio_max);
    }
    if (precio_min) {
      filters.push("precio >= $2");
      values.push(precio_min);
    }
    if (categoria) {
      filters.push("categoria = $3");
      values.push(categoria);
    }
    if (metal) {
      filters.push("metal = $4");
      values.push(metal);
    }
    if (filters.length === 0) {
      throw new Error("Se deben proporcionar al menos un filtro");
    }

    const whereClause = filters.join(" AND ");
    const query = {
      text: `
        SELECT *
        FROM inventario
        WHERE ${whereClause};
      `,
      values,
    };

    const result = await pool.query(query);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
