/*========================================MOSTRAR JSON========================================*/
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    const divProductos = document.querySelector(".contenedor_productos");
    const carritoProductosDiv = document.querySelector(".carrito_productos");

    data.productos.forEach((producto) => {
      const productoHTML = `
        <div class="producto">
          <img src="${producto.imagen}" alt="${producto.producto}">
          <div class="producto_informacion">
            <h2 class="producto_nombre">${producto.producto}</h2>
            <p class="producto_cantidad">${producto.cantidad}</p>
            <p class="producto_precio">${producto.precio_usa}</p>
            <div class="producto_selector_cantidad">
              <span class="material-symbols-outlined restar_cantidad">indeterminate_check_box</span>
              <input type="text" value="0" class="cantidad_input" data-producto-id="${producto.id}" disabled>
              <span class="material-symbols-outlined sumar_cantidad">add_box</span>
              <span class="material-symbols-outlined borrar_cantidad">delete</span>
            </div>
          </div>
        </div>          
      `;

      const productoElement = document.createElement("div");
      productoElement.innerHTML = productoHTML;
      divProductos.appendChild(productoElement);

      const cantidadInput = productoElement.querySelector(".cantidad_input");
      const sumarCantidadSpan = productoElement.querySelector(".sumar_cantidad");
      const restarCantidadSpan = productoElement.querySelector(".restar_cantidad");
      const borrarSpan = productoElement.querySelector(".borrar_cantidad");

      let cantidad = 0; // inicializamos la cantidad para cada producto

      function updateCarritoCantidad(cantidad) {
        const productoCarritoElement = carritoProductosDiv.querySelector(`.producto_carrito[data-producto-id="${producto.id}"]`);
        if (productoCarritoElement) {
          const cantidadInputCarrito = productoCarritoElement.querySelector(".cantidad_input");
          cantidadInputCarrito.value = cantidad;

          // Calculamos el nuevo subtotal y lo mostramos en el carrito
          const precioUSA = parseFloat(producto.precio_usa.replace("$", ""));
          const subtotal = cantidad * precioUSA;
          const subtotalP = productoCarritoElement.querySelector(".producto_carrito_subtotal");
          subtotalP.textContent = `Subt. $${subtotal.toFixed(2)}`;

          // Si la cantidad es 0, eliminamos el producto del carrito
          if (cantidad === 0) {
            productoCarritoElement.remove();
          }
        }
      }

      sumarCantidadSpan.addEventListener("click", () => {
        cantidad++;
        cantidadInput.value = cantidad;
        updateCarritoCantidad(cantidad);

        let productoCarritoElement = carritoProductosDiv.querySelector(`.producto_carrito[data-producto-id="${producto.id}"]`);
        
        if (!productoCarritoElement) {
          // Si el producto no existe en el carrito, lo agregamos
          const productoCarritoHTML = `
            <div class="producto_carrito" data-producto-id="${producto.id}">
              <img src="${producto.imagen}" alt="${producto.producto}">
              <div class="producto_carrito_informacion">
                <div class="producto_carrito_detalles">
                  <h2 class="producto_carrito_nombre">${producto.producto}</h2>
                  <h3 class="producto_carrito_cantidad">${producto.cantidad}</h3>
                </div>
                <div class="producto_carrito_valores">
                  <p class="producto_carrito_precio">Prec. ${producto.precio_usa}</p>
                  <p class="producto_carrito_subtotal">Subt. $${(cantidad * parseFloat(producto.precio_usa.replace("$", ""))).toFixed(2)}</p>
                </div>
                <div class="producto_carrito_selector_cantidad">
                  <span class="material-symbols-outlined restar_cantidad">indeterminate_check_box</span>
                  <input type="text" value="${cantidad}" class="cantidad_input" disabled>
                  <span class="material-symbols-outlined sumar_cantidad">add_box</span>
                  <span class="material-symbols-outlined borrar_cantidad">delete</span>
                </div>
              </div>
            </div>
          `;
          productoCarritoElement = document.createElement("div");
          productoCarritoElement.innerHTML = productoCarritoHTML;
          carritoProductosDiv.appendChild(productoCarritoElement);

          // Asignamos eventos para sumar, restar y borrar producto en el carrito
          const sumarCarrito = productoCarritoElement.querySelector(".sumar_cantidad");
          const restarCarrito = productoCarritoElement.querySelector(".restar_cantidad");
          const borrarCarrito = productoCarritoElement.querySelector(".borrar_cantidad");

          sumarCarrito.addEventListener("click", () => {
            cantidad++;
            cantidadInput.value = cantidad;
            updateCarritoCantidad(cantidad);
          });

          restarCarrito.addEventListener("click", () => {
            if (cantidad > 0) {
              cantidad--;
              cantidadInput.value = cantidad;
              updateCarritoCantidad(cantidad);
            }
            if (cantidad === 0) {
              productoCarritoElement.remove();
            }
          });

          borrarCarrito.addEventListener("click", () => {
            cantidad = 0;
            cantidadInput.value = cantidad;
            productoCarritoElement.remove();
          });
        }
      });

      restarCantidadSpan.addEventListener("click", () => {
        if (cantidad > 0) {
          cantidad--;
          cantidadInput.value = cantidad;
          updateCarritoCantidad(cantidad);
        }
      });

      borrarSpan.addEventListener("click", () => {
        cantidad = 0;
        cantidadInput.value = cantidad;
        updateCarritoCantidad(cantidad);
      });
    });
  })
  .catch(error => console.error('Error:', error));
