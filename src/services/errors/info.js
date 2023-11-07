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
