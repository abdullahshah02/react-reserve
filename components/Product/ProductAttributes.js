import React from 'react'
import { Header, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import baseURL from '../../utils/baseUrl'
import { useRouter } from 'next/router'

function ProductAttributes({ description, _id, user }) {

  const [modal, setModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter();

  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isAdmin || isRoot;

  React.useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => { setSuccess(false) }, 10000)
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [success])

  async function handleDelete() {
    setLoading(true);
    const url = `${baseURL}/api/product`
    const payload = { params: { _id } }
    await axios.delete(url, payload)
    router.push('/');
    setLoading(false);
    setSuccess(true);
  }

  return <>
    <Header as="h3">About this product</Header>
    <p>{description}</p>

    {isRootOrAdmin &&
      <>
        <Button
          icon="trash alternate outline"
          color="red"
          content="Delete Product"
          onClick={() => setModal(true)}
        />

        <Modal open={modal} dimmer="blurring">
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this product?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancel"
              onClick={() => setModal(false)}
            />
            {
              success
                ?
                <Button
                  negative
                  icon="trash alternate outline"
                  content="Product Deleted"
                  disabled="true"
                />
                :
                <Button
                  negative
                  icon="trash alternate outline"
                  content="Delete"
                  onClick={handleDelete}
                  disabled={loading}
                  loading={loading}
                />
            }

          </Modal.Actions>
        </Modal>
      </>
    }
  </>;
}

export default ProductAttributes;
