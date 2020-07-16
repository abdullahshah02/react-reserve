import { Card } from 'semantic-ui-react'

function ProductList({products}) {

  function mapProductsToItems(products) {
    return products.map(product => ({
      header: product.name,
      image: product.mediaUrl,
      meta: `$${product.price}`,
      color: 'blue',
      fluid: true,
      childKey: product._id,
      href: `/product?_id=${product._id}`
    }))
  }

  return <>
    <Card.Group 
    items={mapProductsToItems(products)} 
    itemsPerRow="3" 
    stackable
    centered/>
  </>;
}

export default ProductList;
