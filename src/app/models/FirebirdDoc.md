# Funciones Firebird

# all()
Esta funcion recibe 5 un objeto con los siguientes parametros OPCIONALES, segun sea el caso.

- **limit** - Donde se establece el numero de registros a obtener de la consulta, por defecto retorna 20 registros, pero se puede cambiar.

- **skip** - Registros a saltar para hacer una paginacion y debe ser multiplo de **limit**, ejemplo, si el limite que se manda es 10, entonces al hacer el primer salto de paginacion **skip** debe ser 10, al segundo salto de paginacion **skip** debe ser 20, y asi sucesivamente.

- **searchQuery** - Consulta sql con el nombre de la o las columnas a buscar usando sintaxis SQL.

- **orderBy** - Nombre de la columna por el cual se desee ordenar los registros.

- **sort** - Ordena de manera ascendente (*asc*) o de manera descentente (*desc*).

```js
    Alumno.all({
        limit: 15,
        skip: 0,
        searchQuery: "nombre LIKE '%eduardo%'",
        orderBy: 'matricula',
        sort: 'desc'
    });
```

# create()
Esta funcion recibe un objeto con las columnas necesarias y sus valores para agregar y crear nuevo registro.

```js
    Alumno.create({
        nombre: 'chuco alberto',
        correo: 'chucho@correo.com',
        edad: 21
    });
```

# findById()
Esta funcion recibe solo un parametro, el cual es el id a buscar, y regresara un objeto del registro a buscar. 

El id buscara sobre la columna registrada en su Model como su **Primary key**, se puede mandar un string o una serie de numeros

```js
    Alumno.findById('cs-ds-21');
    Alumno.findById(237843);
```

# findByIdAndUpdate()
Esta funcion busca por id y actualiza los datos mandados y recibe solamente 2 parametros:
- **id** - El cual, se coloca el id del registro a actualizar.
- **data** - Es un objeto con las columnas y sus datos a actualizar.

```js
    Alumno.findByIdAndUpdate('cs-ds-21', {
        correo: 'nuevoCorreo@correo.com',
        celular: '38949834'
    });
```

# Where()
Esta funcion, filtra los resultados el cual cumplan con las condiciones mandadas, y recibe 5 parametros en el siguiente orden.

- **conditions** - El cual es un objeto con las columnas y un array de las condiciones a filtrar, ya sea *strings* o *numbers*.

- **limit** - Donde se establece el numero de registros a obtener de la consulta, por defecto retorna 30 registros, pero se puede cambiar.

- **skip** - Registros a saltar para hacer una paginacion y debe ser multiplo de **limit**.

- **strict** - Este parametro recibe un *Boleano* opcional y por defecto es **false**, lo que hace esta opcion es que las condiciones mandados en el primer parametro lo busque de manera estricta. 

    Es decir, que si esta en **true** solamente busque los registros que estab condicionados, es decir, basandonos en el ejemplo, solo buscara los registros que tengan el nombre, correo y edad en una misma columna como se registro en las otras condiciones.

    Y en caso que no se ponga nada, por defecto es **false**, el cual buscara en los registros las coincidencias con cada columna sin importar que no coincida con las condiciones anteriores.

```js
    Alumno.where({
        nombre: ['fabian', 'eduardo', 'carlos'],
        correo: ['@gmail.com'],
        edad: [20, 21]
    }, 8, 32, true);
```

### Cualquier duda contactar con su ascesor de desarrollo, pero la practica hace al maestro. Suerte.