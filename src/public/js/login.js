const form = document.querySelector("#loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (result) => {
    if (result.status === 200) {
      const response = await result.json(); // Parsea la respuesta JSON
      const payload = response.payload; // Asume que el payload está en el campo 'payload', ajusta según tu estructura de respuesta

      // Agregar el payload al localStorage
      localStorage.setItem("user", JSON.stringify(payload));
      swal
        .fire({
          icon: "success",
          title: "Ok!",
          text: "Login correcto!",
          timer: 2000,
          showConfirmButton: false,
        })
        .then(function () {
          window.location.replace("/static/products");
        });
    } else {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login incorrecto!",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});
