const ckeckGet = async (req,res,next) =>{
    try {
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }     
}

const checkGetFilter = async (req,res,next)=>{
    try {
        const { precio_min, precio_max, categoria, metal } = req.query;
        if(!precio_min || !precio_max || !categoria || !metal){
                res.status(400).json({
                error: "Campos invalidos",
                url: `${req.url}`,
                msg: `todos los campos son requeridos, precio_min: ${precio_min}; precio_max: ${precio_max}; categoria${categoria}; metal${metal}`
                });
        }
        else if(precio_min<0 || precio_max<=0){
                res.status(400).json({
                error: "Valor incorrecto",
                url: `${req.url}`,
                msg: `El valor de precio min ${precio_min} o max${precio_max} no es valido para la solicitud`
                });
        }
        else if(precio_min>precio_max){
                res.status(400).json({
                error: "Valor incorrecto",
                url: `${req.url}`,
                msg: `El precio maximo ${precio_max} debe ser mayor al precio minimo ${precio_min}`
                });
        }
        else if(!["collar", "aros", "anillo"].includes(categoria)){
                res.status(400).json({
                error: "Valor no soportado",
                url: `${req.url}`,
                msg: `la categoria ${categoria} no es correcta, no existe en la base de datos `
                });
        }
        else if(!["oro","plata"].includes(metal)){
                res.status(400).json({
                error: "Valor no soportado",
                url: `${req.url}`,
                msg: `El metal ${metal} no es correcta, no existe en la base de datos`
                });
        }
        else{
            next();
        }  
    } 
catch (error) {
    res.status(400).json({ error: error.message });
    }
}


module.exports = {ckeckGet, checkGetFilter};