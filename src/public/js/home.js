const btn = document.querySelector("#btnLogout");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/api/sessions/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      swal
        .fire({
          icon: "success",
          title: "Ok!",
          text: "Logout success!",
          timer: 2000,
          showConfirmButton: false,
        })
        .then(function () {
          window.location.replace("/login");
        });
    } else {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al realizar el logout!",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});
