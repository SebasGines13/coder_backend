document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.querySelector(".carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const finalizeBtn = document.getElementById("finalizeBtn");
  const userNameElement = document.getElementById("userName");
  // Recuperar el objeto del localStorage
  const storedUserObject = localStorage.getItem("user");
  const localStorageUser = storedUserObject
    ? JSON.parse(storedUserObject)
    : null;
  const cartIDElement = document.getElementById("cartID");

  // Actualizar el contenido de #cartID si hay un usuario en el localStorage con información del carrito
  if (localStorageUser && localStorageUser.cart) {
    cartIDElement.textContent = `Carrito ID: ${localStorageUser.cart}`;
  }

  // Actualizar el contenido de #userName si hay un usuario en el localStorage
  if (localStorageUser) {
    userNameElement.textContent = `${localStorageUser.first_name} ${localStorageUser.last_name}`;
  }

  let currentPage = 1;
  let totalPages = 1;
  let cart = document.querySelector(".cart");
  let selectedProducts = {}; // Objeto para rastrear la cantidad de productos seleccionados
  let total = document.querySelector(".total");

  if (localStorageUser.cart) {
    const cartDetails = await fetchCartDetails(localStorageUser.cart);
    if (cartDetails) {
      selectedProducts = {};

      cartDetails.forEach((cartItem) => {
        const productId = cartItem._id;
        selectedProducts[productId] = cartItem;
      });

      // Actualizar la interfaz con los productos del carrito
      for (const productId in selectedProducts) {
        const productInfo = selectedProducts[productId];
        cart.appendChild(createProductElement(productInfo));
      }

      // Actualizar el total después de cargar los productos del carrito
      updateTotal();
    }
  }

  async function fetchProducts(page, search) {
    const response = await fetch(
      `/api/products?limit=6&page=${page}&filter=${search}`
    );
    const data = await response.json();
    return data;
  }

  // Agrega un event listener al botón "Finalizar Compra"
  finalizeBtn.addEventListener("click", async () => {
    // Realiza la lógica necesaria para finalizar la compra

    // Suponiendo que tienes el usuario almacenado en el localStorage
    const storedUserObject = localStorage.getItem("user");
    const user = storedUserObject ? JSON.parse(storedUserObject) : null;

    // Llamada a la función para enviar el correo electrónico
    if (user) {
      // Actualiza la interfaz después de borrar el carrito, por ejemplo, actualiza el contenido del carrito y el total
      const cartElement = document.querySelector(".cart");
      selectedProducts = {};
      if (cartElement) {
        cartElement.innerHTML = "";
      }
      updateTotal();
      const cartId = localStorageUser.cart;
      const purchaseEndpoint = `/api/carts/${cartId}/purchase`;
      await fetch(purchaseEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (result) => {
        if (result.status === 201) {
          swal.fire({
            icon: "success",
            title: "Ok!",
            text: "Compra realizada correctamente!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Compra incorrecta!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    } else {
      console.error(
        "No se encontró información de usuario para enviar el correo."
      );
    }
  });

  // Función para crear una tarjeta de producto
  function createCard(product) {
    if (!product || !product.title || !product.description || !product.price) {
      console.error("El producto no tiene la información necesaria:", product);
      return null; // Evita crear la tarjeta si la información es inválida
    }

    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    const img = document.createElement("img");
    img.src =
      product.thumbnails.length > 0 ? product.thumbnails[0] : "placeholder.jpg";
    img.alt = product.title;
    img.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const name = document.createElement("h5");
    name.classList.add("card-title");
    name.textContent = product.title;

    const description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.classList.add("card-text");
    price.textContent = `$${product.price}`;

    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("btn", "btn-dark");
    addToCartBtn.textContent = "Agregar al carrito";
    addToCartBtn.addEventListener("click", () => addToCart(product));

    cardBody.appendChild(name);
    cardBody.appendChild(description);
    cardBody.appendChild(price);
    cardBody.appendChild(addToCartBtn);

    card.appendChild(img);
    card.appendChild(cardBody);

    return card;
  }

  async function initCarousel(searchTerm) {
    const data = await fetchProducts(currentPage, searchTerm);
    totalPages = data.totalPages;

    data.docs.forEach((product) => {
      const card = createCard(product);
      carousel.appendChild(card);
    });

    updatePaginationInfo();

    prevBtn.addEventListener("click", () =>
      changePage(currentPage - 1, searchTerm)
    );
    nextBtn.addEventListener("click", () =>
      changePage(currentPage + 1, searchTerm)
    );
  }

  async function addToCart(product) {
    const productId = product._id;

    if (selectedProducts[productId]) {
      selectedProducts[productId].quantity++;
    } else {
      try {
        // Utiliza getProductById para obtener el producto por ID
        const detailedProduct = await getProductById(productId);

        // Agrega el producto al carrito
        detailedProduct.quantity = 1;
        selectedProducts[productId] = detailedProduct;

        // Actualiza la interfaz del carrito en el cliente
        cart.appendChild(createProductElement(detailedProduct));
      } catch (error) {
        console.error(
          `Error al obtener o agregar el producto por ID: ${error}`
        );
      }
    }

    // Luego de haber agregado el producto al carrito en el servidor, actualiza la cantidad en la interfaz
    updateCartItemQuantity(
      localStorageUser.cart,
      productId,
      selectedProducts[productId].quantity
    );

    // Actualiza el total
    updateTotal();
  }

  // Función para agregar un producto al carrito del usuario en el servidor
  async function addToUserCart(cartId, productId, quantity) {
    try {
      let urlPut = `/api/carts/${cartId}/product/${productId}`;
      if (quantity > 1) {
        // si no es la primera vez que se agrega al carrito, se agrega la cantidad
        urlPut = `/api/carts/${cartId}/products/${productId}`;
      }
      const response = await fetch(urlPut, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity }),
      });
    } catch (error) {
      console.error(
        `Error en la solicitud al agregar el producto al carrito del usuario: ${error}`
      );
    }
  }

  function createProductElement(product) {
    const productContainer = document.createElement("div");
    productContainer.classList.add("product");
    productContainer.dataset.productId = product._id;

    const productName = product.title || "Nombre no disponible";
    const productPrice = product.price || 0;

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("product-details");

    const nameElement = document.createElement("span");
    nameElement.classList.add("product-name");
    nameElement.textContent = `| ${productName}`;

    const priceElement = document.createElement("span");
    priceElement.classList.add("product-price");
    priceElement.textContent = ` $${productPrice}`;

    const quantityElement = document.createElement("span");
    quantityElement.classList.add("quantity");
    quantityElement.textContent = `${product.quantity}x `;

    // Estilos CSS para separar y alinear los elementos
    productContainer.style.display = "flex";
    productContainer.style.justifyContent = "space-between";

    detailsContainer.appendChild(quantityElement);
    detailsContainer.appendChild(nameElement);
    detailsContainer.appendChild(priceElement);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "btn-sm"); // Añade la clase "btn-sm" para hacer el botón más pequeño
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () =>
      deleteProductFromCart(product._id)
    );

    // Estilos adicionales para el botón
    deleteButton.style.marginTop = "4px";
    deleteButton.style.marginBottom = "4px";

    productContainer.appendChild(detailsContainer);
    productContainer.appendChild(deleteButton);

    return productContainer;
  }

  async function deleteProductFromCart(productId) {
    // Realiza una solicitud DELETE al endpoint /api/carts/cartID/products/productID
    try {
      await fetch(`/api/carts/${localStorageUser.cart}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(
        `Error en la solicitud al eliminar el producto del carrito: ${error}`
      );
    }

    // Elimina el producto del objeto selectedProducts
    delete selectedProducts[productId];

    // Actualiza la interfaz después de eliminar el producto, por ejemplo, actualiza el contenido del carrito y el total

    if (cart) {
      cart.innerHTML = "";
      for (const productId in selectedProducts) {
        const productInfo = selectedProducts[productId];
        cart.appendChild(createProductElement(productInfo));
      }
    }
    updateTotal();
  }

  async function updateCartItemQuantity(userCartId, productId, quantity) {
    const cartItems = cart.querySelectorAll(".product");
    await addToUserCart(userCartId, productId, quantity);

    for (const item of cartItems) {
      const itemId = item.dataset.productId;

      if (itemId === productId) {
        const quantityElement = item.querySelector(".quantity");
        quantityElement.textContent = `${quantity}x `;
        break;
      }
    }
  }

  clearCartBtn.addEventListener("click", () => {
    // Lógica para borrar el carrito
    clearCart();
  });

  function clearCart() {
    // Implementa la lógica para borrar el carrito, por ejemplo, reiniciar selectedProducts
    selectedProducts = {};

    // Realiza una solicitud DELETE al endpoint /api/carts/cartID
    deleteCart(localStorageUser.cart);

    // Actualiza la interfaz después de borrar el carrito, por ejemplo, actualiza el contenido del carrito y el total
    const cartElement = document.querySelector(".cart");
    if (cartElement) {
      cartElement.innerHTML = "";
    }
    updateTotal();
  }

  // Función para borrar el carrito del usuario en el servidor
  async function deleteCart(cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (result) => {
        if (result.status === 200) {
          swal.fire({
            icon: "success",
            title: "Ok!",
            text: "Carrito eliminado correctamente!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Logout incorrecto!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      console.error(
        `Error en la solicitud al borrar el carrito del usuario: ${error}`
      );
    }
  }

  function updateTotal() {
    total.textContent = `Total: $${calculateCartTotal()}`;
  }

  function calculateCartTotal() {
    let cartTotal = 0;

    for (const productId in selectedProducts) {
      const productInfo = selectedProducts[productId];
      cartTotal += productInfo.price * productInfo.quantity;
    }
    return cartTotal;
  }

  function changePage(page, searchTerm) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      carousel.innerHTML = "";
      initCarousel(searchTerm);
    }
  }

  function updatePaginationInfo() {
    const paginationInfo = document.querySelector(".pagination-info");
    if (paginationInfo) {
      paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
  }

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    changePage(1, searchTerm);
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    changePage(1, searchTerm);
  });

  initCarousel("");
});

async function getProductById(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    console.error(`Error al obtener el producto por ID: ${error}`);
    return {};
  }
}

const logoutBtn = document.getElementById("logoutBtn");
// Agrega un event listener al botón
logoutBtn.addEventListener("click", () => {
  // Realiza una solicitud fetch para el endpoint de logout
  fetch("/api/sessions/logout", {
    method: "GET", // Puedes usar el método que corresponda a tu implementación
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (result) => {
    if (result.status === 200) {
      localStorage.removeItem("user");
      swal
        .fire({
          icon: "success",
          title: "Ok!",
          text: "Logout correcto!",
          timer: 2000,
          showConfirmButton: false,
        })
        .then(function () {
          window.location.replace("/static/login");
        });
    } else {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Logout incorrecto!",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});

// Función para obtener los detalles del carrito del servidor
async function fetchCartDetails(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`);
    const cartDetails = await response.json();

    // Mapear la respuesta para devolver un objeto más manejable
    const mappedCartDetails = cartDetails.map((cartItem) => {
      return {
        _id: cartItem.id_prod._id,
        title: cartItem.id_prod.title,
        description: cartItem.id_prod.description,
        price: cartItem.id_prod.price,
        stock: cartItem.id_prod.stock,
        category: cartItem.id_prod.category,
        status: cartItem.id_prod.status,
        code: cartItem.id_prod.code,
        thumbnails: cartItem.id_prod.thumbnails,
        quantity: cartItem.quantity,
        cartItemId: cartItem._id,
      };
    });
    return mappedCartDetails;
  } catch (error) {
    console.error(`Error al obtener detalles del carrito: ${error}`);
    return null;
  }
}
