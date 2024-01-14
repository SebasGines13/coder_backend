const form = document.querySelector("#registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      swal
        .fire({
          icon: "success",
          title: "Ok!",
          text: "Registro correcto!",
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
        text: "Registro incorrecto!",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});
