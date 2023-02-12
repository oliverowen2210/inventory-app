Desplegado en Railway: https://inventory-app-production-27a3.up.railway.app/

![Imagen del sitio. Se ven dos objetos dentro de una categoria.](https://user-images.githubusercontent.com/95064346/218336927-6c339b6c-a07e-4dc7-aee1-a0a8a631e407.png)


Una aplicación donde se puede hacer operaciones CRUD en las categorias o los articulos que les pertenecen. 

Imagenes almacenadas en Firebase Storage, todos los demás datos en MongoDB con ayuda del ODM Mongoose para imponer esquemas a través de modelos.

API desarrollado con Node.js y Express.js. Algunos de los middleware utilizados son Multer para procesar imagenes, dotenv para guardar variables de entorno, 
y express-validator para validar la entrada del usuario cuando se crea una categoria o un articulo.
