const ckeckGet = async (req,res,next) =>{
        const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;
        const orderParams = order_by.split("_");
        if (limits <= 0 || page <= 0) {
          res.status(400).json({
            error: "Bad Request",
            msg: "Valores de páginación o límite incorrectos"
          })
        }
        else if (orderParams.length !== 2 
            ||!["id", "nombre", "categoria", "metal", "precio", "stock"].includes(orderParams[0]) 
            ||!["ASC", "DESC"].includes(orderParams[1])
        ) {
            res.status(400).json({
            error: "Bad Request",
            msg: "Parámetro order_by incorrecto"
            })
        }
        else {
            next();
        }   
}

module.exports = ckeckGet;