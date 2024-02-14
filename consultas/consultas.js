const pool = require("../config/database");

const getData = async(req,res)=>{
    try {
        const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;
        // if (limits <= 0 || page <= 0) {
        //   throw new Error("Valores de página o límite incorrectos");
        // }
        const offset = (page - 1) * limits;
        const orderParams = order_by.split("_");
        // if (
        //   orderParams.length !== 2 ||
        //   !["id", "nombre", "categoria", "metal", "precio", "stock"].includes(
        //     orderParams[0]
        //   ) ||
        //   !["ASC", "DESC"].includes(orderParams[1])
        // ) {
        //   throw new Error("Parámetro order_by incorrecto");
        // }
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
        res.json({
            data:joyasWithLinks 
        })
        
      } catch (error) {
        res.json({error: error.message});
      }
    }

module.exports =getData;