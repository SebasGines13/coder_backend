import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 100 }),
    stock: faker.commerce.price({ min: 0, max: 200, dec: 0 }),
    category: faker.commerce.department(),
    status: true,
    code: faker.commerce.isbn(10), // '1-155-36404-X'
    thumbnails: [faker.image.urlLoremFlickr()],
  };
};
