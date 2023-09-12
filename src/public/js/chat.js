const socket = io();

const btnChat = document.querySelector("#btnChat");
const msjHistorico = document.querySelector("#msjHistorico");
const msjNuevo = document.querySelector("#msjNuevo");

let email;
Swal.fire({
  title: "Identificación de usuario",
  text: "Por favor ingrese su email",
  input: "text",

  inputValidator: (valor) => {
    return !valor && "Ingrese un email válido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  email = resultado.value;
});

btnChat.addEventListener("click", () => {
  if (msjNuevo.value.trim().length > 0) {
    socket.emit("addMessage", {
      email: email,
      message: msjNuevo.value,
    });
    msjNuevo.value = "";
  }
});

socket.on("messages", (arrayMensajes) => {
  msjHistorico.innerHTML = ""; // limpio
  arrayMensajes.forEach((msj) => {
    const { email, message } = msj;
    msjHistorico.innerHTML += `<div class="p-3 mb-2 bg-light text-dark">
                                  <p>${email} escribió: </p> <p>${message}</p>
                               </div>`;
  });
});
