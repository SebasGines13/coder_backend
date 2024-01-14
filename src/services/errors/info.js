export const generateProductErrorInfo = (
  title,
  description,
  price,
  stock,
  category,
  code
) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, received ${title}
    * description : needs to be a String, received ${description}
    * price : needs to be a Number, received ${price}
    * stock : needs to be a Number, received ${stock}
    * category : needs to be a String, received ${category}
    * code : needs to be a String, received ${code}`;
};

export const generateUserErrorInfo = (user) => {
  return `
  One or more properties were incomplete or not valid.
  List of required properties:
  * first_name: needs to be a String, received ${user.first_name}
  * last_name: needs to be a String, received ${user.last_name}
  * email: needs to be a String, received ${user.email}
  `;
};
