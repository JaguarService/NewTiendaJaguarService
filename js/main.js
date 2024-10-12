document.addEventListener("DOMContentLoaded", () => {
  const divProductos = document.querySelector(".contenedor_productos");
  const carritoProductosDiv = document.querySelector(".carrito_productos");
  const encabezadoCategoria = document.getElementById("encabezado_categoria");
  const filtrosCategoriaDiv = document.getElementById("filtros_categoria");
  const btnAlimentos = document.getElementById("btnAlimentos");
  const btnAseo = document.getElementById("btnAseo");
  const btnCarrito = document.getElementById("btnCarrito");
  const pruebaDiv = document.querySelector(".carrito");

  let productosData = [];
  const cantidades = {};

  // Cargar los productos desde el archivo JSON
  fetch('js/productos.json')
    .then(response => response.json())
    .then(data => {
      productosData = data.productos;
      filtrarProductosPorCategoria("alimentos_y_bebidas"); // Muestra solo productos de Alimentos y Bebidas al inicio
      resaltarBoton(btnAlimentos); // Resalta el botón de Alimentos y Bebidas
      encabezadoCategoria.textContent = "Alimentos y Bebidas"; // Actualiza el encabezado
    })
    .catch(error => console.error('Error:', error));

  // Función para mostrar productos
  function mostrarProductos(productos) {
    divProductos.innerHTML = '';
    productos.forEach((producto) => {
      const cantidad = cantidades[producto.id] || 0;

      const productoHTML = `
      <div class="producto" data-producto-id="${producto.id}">
          <img src="${producto.imagen}" alt="${producto.producto}">
          <div class="producto_informacion">
              <h2 class="producto_nombre">${producto.producto}</h2>
              <p class="producto_cantidad">${producto.cantidad}</p>
              <p class="producto_precio">${producto.precio_usa}</p>
              <div class="producto_selector_cantidad">
                  <span class="material-symbols-outlined restar_cantidad">indeterminate_check_box</span>
                  <input type="text" value="${cantidad}" class="cantidad_input" disabled>
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

      sumarCantidadSpan.addEventListener("click", () => {
        cantidades[producto.id] = (cantidades[producto.id] || 0) + 1; 
        cantidadInput.value = cantidades[producto.id]; 
        updateCarritoCantidad(producto, cantidades[producto.id]);
      });

      restarCantidadSpan.addEventListener("click", () => {
        if (cantidades[producto.id] > 0) {
          cantidades[producto.id]--; 
          cantidadInput.value = cantidades[producto.id]; 
          updateCarritoCantidad(producto, cantidades[producto.id]);
        }
      });

      borrarSpan.addEventListener("click", () => {
        cantidades[producto.id] = 0; 
        cantidadInput.value = cantidades[producto.id]; 
        updateCarritoCantidad(producto, cantidades[producto.id]);
      });
    });
  }

  // Evento para el botón de Alimentos
  btnAlimentos.addEventListener("click", () => {
    pruebaDiv.style.display = "none"; // Oculta la sección del carrito
    // Aquí puedes agregar más lógica si es necesario para mostrar productos
  });

  // Evento para el botón de Aseo
  btnAseo.addEventListener("click", () => {
      pruebaDiv.style.display = "none"; // Oculta la sección del carrito
      // Aquí puedes agregar más lógica si es necesario para mostrar productos
  });

  // Evento para el botón del Carrito
  btnCarrito.addEventListener("click", () => {
      pruebaDiv.style.display = "block"; // Muestra la sección del carrito
      // Aquí puedes agregar más lógica si es necesario para mostrar el contenido del carrito
  });

  // Función para actualizar el carrito
  function updateCarritoCantidad(producto, cantidad) {
    const productoCarritoElement = carritoProductosDiv.querySelector(`.producto_carrito[data-producto-id="${producto.id}"]`);
    
    if (productoCarritoElement) {
      const cantidadInputCarrito = productoCarritoElement.querySelector(".cantidad_input");
      cantidadInputCarrito.value = cantidad; 

      const precioUSA = parseFloat(producto.precio_usa.replace("$", ""));
      const subtotal = cantidad * precioUSA;
      const subtotalP = productoCarritoElement.querySelector(".producto_carrito_subtotal");
      subtotalP.textContent = `Subt. $${subtotal.toFixed(2)}`;
      
      if (cantidad === 0) {
        productoCarritoElement.remove();
      }
    } else {
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
                  <input type="text" value="${cantidad}" class="cantidad_input">
                  <span class="material-symbols-outlined sumar_cantidad">add_box</span>
                  <span class="material-symbols-outlined borrar_cantidad">delete</span>
              </div>
          </div>
      </div>
      `;
      const productoCarritoElement = document.createElement("div");
      productoCarritoElement.innerHTML = productoCarritoHTML;
      carritoProductosDiv.appendChild(productoCarritoElement);

      const sumarCarrito = productoCarritoElement.querySelector(".sumar_cantidad");
      const restarCarrito = productoCarritoElement.querySelector(".restar_cantidad");
      const borrarCarrito = productoCarritoElement.querySelector(".borrar_cantidad");

      sumarCarrito.addEventListener("click", () => {
        cantidades[producto.id] = (cantidades[producto.id] || 0) + 1; 
        updateCarritoCantidad(producto, cantidades[producto.id]);
        
        const cantidadInput = divProductos.querySelector(`.producto[data-producto-id="${producto.id}"] .cantidad_input`);
        cantidadInput.value = cantidades[producto.id]; 
        actualizarCarrito();
      });

      restarCarrito.addEventListener("click", () => {
        if (cantidades[producto.id] > 0) {
          cantidades[producto.id]--; 
          updateCarritoCantidad(producto, cantidades[producto.id]);
          const cantidadInput = divProductos.querySelector(`.producto[data-producto-id="${producto.id}"] .cantidad_input`);
          cantidadInput.value = cantidades[producto.id]; 
          actualizarCarrito();
        }
      });

      borrarCarrito.addEventListener("click", () => {
        cantidades[producto.id] = 0; 
        productoCarritoElement.remove();
        const cantidadInput = divProductos.querySelector(`.producto[data-producto-id="${producto.id}"] .cantidad_input`);
        cantidadInput.value = cantidades[producto.id]; 
        actualizarCarrito();
      });
    }
    actualizarCarrito(); // Llama a la función para verificar si el carrito está vacío
  }

  // Función para actualizar el estado del carrito
  function actualizarCarrito() {
    const productosEnCarrito = carritoProductosDiv.querySelectorAll(".producto_carrito");
    if (productosEnCarrito.length === 0) {
      mostrarMensajeCarritoVacio(); // Muestra el mensaje si el carrito está vacío
    } else {
      ocultarMensajeCarritoVacio(); // Oculta el mensaje si hay productos en el carrito
    }
  }

  // Función para mostrar el mensaje cuando el carrito está vacío
  function mostrarMensajeCarritoVacio() {
    const carritoVacioDiv = document.querySelector(".carrito_vacio");
    carritoVacioDiv.style.display = "block"; // Muestra el mensaje
    carritoProductosDiv.style.display = "none"; // Asegúrate de ocultar otros productos en el carrito si es necesario
  }

  // Función para ocultar el mensaje cuando el carrito tiene productos
  function ocultarMensajeCarritoVacio() {
    const carritoVacioDiv = document.querySelector(".carrito_vacio");
    carritoVacioDiv.style.display = "none"; // Oculta el mensaje
    carritoProductosDiv.style.display = "block"; // Muestra el carrito de productos si hay elementos
  }

  function mostrarFiltros(filtros, categoria) {
    filtrosCategoriaDiv.innerHTML = ''; // Limpia los filtros anteriores

    filtros.forEach(filtro => {
      const filtroBtn = document.createElement("button");
      filtroBtn.classList.add("filtro-btn");
      filtroBtn.textContent = filtro;

      // Resalta el filtro "Todos" por defecto
      if (filtro === "Todos") {
        filtroBtn.classList.add("filtro-activo");
      }

      filtroBtn.addEventListener("click", () => {
        filtroActivo = filtro;
        filtrarProductos(categoria, filtro); // Filtrar productos por la categoría y filtro seleccionado
        resaltarFiltroActivo(filtroBtn); // Resalta el filtro seleccionado
      });

      filtrosCategoriaDiv.appendChild(filtroBtn);
    });
  }
  // Función para resaltar el filtro activo
  function resaltarFiltroActivo(filtroBtnSeleccionado) {
    const filtrosBtns = filtrosCategoriaDiv.querySelectorAll(".filtro-btn");
    filtrosBtns.forEach(btn => {
      btn.classList.remove("filtro-activo"); // Elimina el resaltado de todos los botones
    });
    filtroBtnSeleccionado.classList.add("filtro-activo"); // Resalta el botón seleccionado
  }
  // Función para filtrar productos por categoría y filtro
  function filtrarProductos(categoria, filtro) {
    const productosFiltrados = productosData.filter(producto => {
      if (filtro === "Todos") {
        return producto.categoria === categoria;
      } else {
        return producto.categoria === categoria && producto.filtro === filtro;
      }
    });
    mostrarProductos(productosFiltrados); // Muestra los productos filtrados
  }

  // Función para filtrar productos por categoría y actualizar encabezado
  function filtrarProductosPorCategoria(categoria, filtroSeleccionado = "Todos") {
    const productosFiltrados = productosData.filter(producto => {
      const esCategoriaValida = producto.categoria === categoria;
      const esFiltroValido = filtroSeleccionado === "Todos" || producto.filtro === filtroSeleccionado;
      return esCategoriaValida && esFiltroValido;
    });
    mostrarProductos(productosFiltrados);

    // Actualizar encabezado según la categoría seleccionada
    if (categoria === "alimentos_y_bebidas") {
      encabezadoCategoria.textContent = "Alimentos y Bebidas";
      const filtrosAlimentos = ["Todos", "carnicos", "bebidas", "lacteos", "granos", "pastas", "varios"];
      mostrarFiltros(filtrosAlimentos, categoria);
    } else if (categoria === "aseo_y_limpieza") {
      encabezadoCategoria.textContent = "Aseo y Limpieza";
      const filtrosAseo = ["Todos", "aseo", "limpieza"];
      mostrarFiltros(filtrosAseo, categoria);
    }
  }

  // Eventos de los botones de categoría
  btnAlimentos.addEventListener("click", () => {
    divProductos.style.display = "flex"; 
    carritoProductosDiv.style.display = "none"; 
    filtrarProductosPorCategoria("alimentos_y_bebidas");
    resaltarBoton(btnAlimentos); // Resalta el botón de Alimentos y Bebidas
  });

  btnAseo.addEventListener("click", () => {
    divProductos.style.display = "flex"; 
    carritoProductosDiv.style.display = "none"; 
    filtrarProductosPorCategoria("aseo_y_limpieza");
    resaltarBoton(btnAseo); // Resalta el botón de Aseo y Limpieza
  });

  btnCarrito.addEventListener("click", () => {
    divProductos.style.display = "none"; 
    carritoProductosDiv.style.display = "block"; 
    filtrosCategoriaDiv.innerHTML = ""; // Limpiar filtros cuando se accede al carrito
    encabezadoCategoria.textContent = "Tu Carrito"; // Establecer el encabezado del carrito
    resaltarBoton(btnCarrito); // Resalta el botón del Carrito
    actualizarCarrito(); // Llama para actualizar el estado del carrito al abrirlo
  });

  // Función para resaltar el botón activo
  function resaltarBoton(botonActivo) {
    const botones = [btnAlimentos, btnAseo, btnCarrito];
    botones.forEach(boton => {
      if (boton === botonActivo) {
        boton.style.backgroundColor = "#393b4e"; // Color de fondo azul para el botón activo
        boton.style.color = "white"; // Texto en blanco para el botón activo
      } else {
        boton.style.backgroundColor = ""; // Color de fondo original para otros botones
        boton.style.color = ""; // Texto en color original para otros botones
      }
    });
  }
});

