const socket = io();

const productRows = document.querySelector("#productRows");

socket.on("listProducts", (products) => {
  productRows.innerHTML = "";
  products.forEach((product) => {
    productRows.innerHTML += `
    <tr>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>$${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
    </tr> 
    `;
  });
});
