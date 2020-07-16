import React from 'react'
import { Segment } from 'semantic-ui-react'
import CartItemList from '../components/Cart/CartItemList'
import CartSummary from '../components/Cart/CartSummary'
import { parseCookies } from 'nookies'
import axios from 'axios'
import baseURL from '../utils/baseUrl'
import catchErrors from '../utils/catchErrors'
import cookie from 'js-cookie'

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = React.useState(products)
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleRemoveFromCart(productID) {
    const url = `${baseURL}/api/cart`;
    const token = cookie.get('token');
    const payload = {
      params: { productID },
      headers: { authorization: token }
    }
    const response = await axios.delete(url, payload);
    setCartProducts(response.data)
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      const url = `${baseURL}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { authorization: token } };
      const response = await axios.post(url, payload, headers);
      setSuccess(true);
    }
    catch (error) {
      const errMsg = catchErrors(error);
      window.alert(errMsg);
      console.error(errMsg);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Segment loading={loading}>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        user={user}
        products={cartProducts}
        success={success}
      />
      <CartSummary
        handleCheckout={handleCheckout}
        products={cartProducts}
        success={success}
      />
    </Segment>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const url = `${baseURL}/api/cart`;
  const payload = { headers: { authorization: token } };
  const response = await axios.get(url, payload);
  return ({ products: response.data });
}

export default Cart;
