const socket = io();

const form = document.querySelector("#formProduct");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  const product = Object.fromEntries(datForm);
  Swal.fire("Bien hecho!", "Producto creado exitosamente!", "success");
  socket.emit("addProduct", product);
  e.target.reset();
});
