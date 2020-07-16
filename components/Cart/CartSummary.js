import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Button, Segment, Divider } from 'semantic-ui-react'
import calculateCartTotal from '../../utils/calculateCartTotal'

function CartSummary({ products, handleCheckout, success }) {

  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products)
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products])

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total: </strong> ${cartAmount}
        <StripeCheckout
          name="React Reserve"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={handleCheckout}
          triggerEvent="onClick"
          stripeKey="pk_test_51Gxz8jHPPs7z1wfk5khZDSBDDDDcAA7lXebPI2H19UA71HqJ2D3HVrUkGdeaJWNjKC4BPCf7BupvuefhK9jNKsS300d6er8QhC"
        >
          <Button
            icon="cart"
            color="blue"
            floated="right"
            content="Checkout"
            disabled={isCartEmpty || success}
          />
        </StripeCheckout>
      </Segment>
    </>
  )
}

export default CartSummary;
