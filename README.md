# React Reserve

## Link: https://react-reserve.glitch.me

### Description:
React Reserve is an e-commerce app created using the MERN stack.

### Feature List:
1.	Sign Up
2.	Login/Logout
3.	User roles (root, admin, user)
4.	User Cart
5.	Checkout
6.	Create Product (Admin Users only)
7.	Toggle admin priveleges for users (Root User only)
8.	View order history
9.	Image and File Uploads
10.	Pagination

### Root User profile
![Root User screen](https://cdn.discordapp.com/attachments/686543270943522825/733263262002446336/unknown.png)

### Admin User profile
![Root User screen](https://cdn.discordapp.com/attachments/686543270943522825/733262515839959080/AdminUser.png)

### Normal User profile
![Root User screen](https://cdn.discordapp.com/attachments/686543270943522825/733263173657952276/unknown.png)

### Create Product Route
![Create Product route](https://cdn.discordapp.com/attachments/686543270943522825/733263850463559750/CreateProduct.png)
 
### Stack: MERN
 
### Technologies used: 
1. MongoDB 
2. Express
3. React
4. NodeJS
5. NextJS
6. Semantic UI React

### Environment variables(next.config.js):
```
module.exports = {
 env: {
	MONGO_SRV: '<insert here>',
	JWT_SECRET: '<insert here>',
	CLOUDINARY_URL: '<insert here>',
	CLOUDINARY_CLOUD_NAME: '<insert here>',
	CLOUDINARY_PRESET: '<insert here>',
	STRIPE_SECRET_KEY: '<insert here>',
	PROD_URL: '<insert here>'	
 },
};
```
