const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const {getData} = require('../consultas/consultas');
const {ckeckGet} = require('../middleware/getError');
const {checkGetFilter}= require('../middleware/getError');
const {getDataFilter} = require('../consultas/consultas');

// Ruta GET /joyas
router.get("/joyas",ckeckGet, getData)

// RUTA GET /jovas/filtros 

router.get('/joyas/filtros',checkGetFilter, getDataFilter)






//     async (req, res) => {
  
//     const { precio_min, precio_max, categoria, metal } = req.query;
//     console.log(categoria)
//     const filters = [];
//     const values = [];

//     if (precio_max) {
//       filters.push(`precio <= ${precio_max}`);
//       values.push(precio_max);
//     }
//     if (precio_min) {
//       filters.push(`precio >= ${precio_min}`);
//       values.push(precio_min);
//     }
//     if (categoria) {
//       filters.push(`categoria ='${categoria}'`);
//       values.push(categoria);
//     }
//     if (metal) {
//       filters.push(`metal = '${metal}'`);
//       values.push(metal);
//     }
//     if (filters.length === 0) {
//       throw new Error('Se deben proporcionar al menos un filtro');
//     }
//     const whereClause = filters.join(' AND ');
//     const query = `SELECT * FROM inventario WHERE ${whereClause};`;
//     console.log(query);
//     const result = await pool.query(query);
//     res.json({ data: result.rows });
// });


module.exports = router;
