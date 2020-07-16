import React from 'react';
import axios from 'axios';
import baseURL from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
import { Form, Input, TextArea, Button, Image, Header, Message, Icon } from 'semantic-ui-react';

const INITIAL_PRODUCT = {
	name: '',
	price: '',
	description: '',
	media: ''
};

function CreateProduct() {

	const [product, setProduct] = React.useState(INITIAL_PRODUCT);
	const [mediaPreview, setMediaPreview] = React.useState('');
	const [success, setSuccess] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [disabled, setDisabled] = React.useState(true);
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		const isProduct = Object.values(product).every(el => Boolean(el));
		isProduct ? setDisabled(false) : setDisabled(true);
	}, [product]);

	function handleChange(event) {
		const { name, value, files } = event.target;

		if (name === 'media') {
			setProduct((prevState) => ({ ...prevState, media: files[0] }));
			setMediaPreview(window.URL.createObjectURL(files[0]));
		}
		else {
			setProduct((prevState) => ({ ...prevState, [name]: value }));
		}
	}

	async function handleImageUpload() {
		const data = new FormData();
		data.append('file', product.media);
		data.append('upload_preset', process.env.CLOUDINARY_PRESET);
		data.append('cloud_name', process.env.CLOUDINARY_CLOUD_NAME);
		const response = await axios.post(process.env.CLOUDINARY_URL, data);
		const mediaUrl = await response.data.url;
		return mediaUrl;
	}

	async function handleSubmit(event) {
		try {
			event.preventDefault();
			setLoading(true);
			const mediaUrl = await handleImageUpload();
			const url = `${baseURL}/api/product`;
			const { name, price, description } = product;
			const payload = { name: name, price, mediaUrl, description };
			await axios.post(url, payload);
			setProduct(INITIAL_PRODUCT);
			setSuccess(true);
			setError('');
		}
		catch (err) {
			const errMsg = catchErrors(err);
			console.error(errMsg);
			setError(errMsg);
		}
		finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Header as='h2' block>
				<Icon name='add' color='orange' />
				Create New Product
			</Header>
			<Form error={Boolean(error)} loading={loading} success={success} onSubmit={handleSubmit}>

				<Message
					error
					header='Oops!'
					content={error}
				/>

				<Message
					success
					icon='check'
					header='Success!'
					content='Your product has been posted.'
				/>
				<Form.Group widths='equal'>
					<Form.Field
						control={Input}
						name='name'
						label='Name'
						placeholder='Name'
						type='text'
						value={product.name}
						onChange={handleChange}
					/>
					<Form.Field
						control={Input}
						name='price'
						label='Price'
						placeholder='Price'
						min='0.00'
						step='0.01'
						type='number'
						value={product.price}
						onChange={handleChange}
					/>
					<Form.Field
						control={Input}
						name='media'
						label='Media'
						type='file'
						content='Select Image'
						accept='image/*'
						onChange={handleChange}
					/>
				</Form.Group>
				<Image src={mediaPreview} rounded centered size='small' />
				<Form.Field
					control={TextArea}
					name='description'
					label='Description'
					placeholder='Description'
					value={product.description}
					onChange={handleChange}
				/>
				<Form.Field
					control={Button}
					disabled={disabled || loading}
					color='blue'
					icon='pencil alternate'
					content='Submit'
					type='submit'
				/>
			</Form>
		</>
	);
}

export default CreateProduct;
