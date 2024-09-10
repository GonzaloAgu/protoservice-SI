# PROTOSERVICE

## Objetivo

Protoservice se trata de un **sistema de gestión de información** en desarrollo para un local de reparación de electrodomésticos, donde se podrá tener un seguimiento de los electrodomésticos ingresados y retirados. La idea es reemplazar el uso del papel en el comercio y tener un historial de las transacciones realizadas de modo que luego se puedan analizar por el comerciante.

## Modelo de datos

El modelo de datos de este sistema es representado por el siguiente diagrama UML.

![Modelo UML de datos](/docs/MD.png)

Para esto se diseñó una base de datos relacional que se implementa en **postgreSQL**. 

## Vistas

Se tienen dos vistas principales en la web: una de **ingreso de reparaciones** y otra de **búsqueda**. Además, se p

### Ingreso

![preview](/docs/preview-ingreso.png)

### Búsqueda

![preview](/docs/preview-consulta.png)
