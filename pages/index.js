import React from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import baseURL from '../utils/baseUrl';
import ProductPagination from '../components/Index/ProductPagination';

function Home({ products, totalPages }) {

	return (
		<>
			<ProductList products={products} />
			<ProductPagination totalPages={totalPages} />
		</>
	);
}

Home.getInitialProps = async (ctx) => {
	const page = ctx.query.page ? ctx.query.page : '1';
	const size = 9;//items per page
	//fetch data on the server
	//return response data as an object
	const url = `${baseURL}/api/products`;
	const payload = { params: { page, size } };
	const response = await axios.get(url, payload);
	return { products: response.data.products, totalPages: response.data.totalPages };
};

export default Home;
