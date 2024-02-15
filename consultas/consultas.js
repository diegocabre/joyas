const pool = require("../config/database");
const format = require('pg-format')

const getData = async(req,res)=>{
    try {
        const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;
        const limit = parseInt(limits);
        const offset = (page - 1) * limits;
        const [orderByField, orderByDirection] = order_by.split("_");
        const value = [orderByField, orderByDirection, limit, offset]
        const query = format(` SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s`,...value);
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
        res.json({
            data:joyasWithLinks 
        })    
    } 
    catch (error) {
        res.json({error: error.message});
    }
};
const getDataFilter = async(req,res) =>{
        const { precio_min, precio_max, categoria, metal } = req.query;
        const filters = [];
        const values = [];
    
        if (precio_max) {
          filters.push(`precio <= ${precio_max}`);
          values.push(precio_max);
        }
        if (precio_min) {
          filters.push(`precio >= ${precio_min}`);
          values.push(precio_min);
        }
        if (categoria) {
          filters.push(`categoria ='${categoria}'`);
          values.push(categoria);
        }
        if (metal) {
          filters.push(`metal = '${metal}'`);
          values.push(metal);
        }
        // if (filters.length === 0) {
        //   throw new Error('Se deben proporcionar al menos un filtro');
        // }
        const whereClause = filters.join(' AND ');
        const query = `SELECT * FROM inventario WHERE ${whereClause};`;
        const result = await pool.query(query);
        res.json({ data: result.rows });
};
module.exports ={getData, getDataFilter};