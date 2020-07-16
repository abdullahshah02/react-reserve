import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import AccountPermissions from '../components/Account/AccountPermissions';
import { parseCookies } from 'nookies';
import baseURL from '../utils/baseUrl';
import axios from 'axios';

function Account({ user, orders }) {
  return <>
    <AccountHeader {...user} />
    <AccountOrders orders={orders}/>
    {user.role === 'root' && <AccountPermissions />}
  </>;
}

Account.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx)
  if (!token) {
    return { orders: [] }
  }

  const payload = {headers: {authorization: token}};
  const url = `${baseURL}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;
}

export default Account;
