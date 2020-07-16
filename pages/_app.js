import App from "next/app";
import Layout from "../components/_App/Layout";
import 'semantic-ui-css/semantic.min.css';
import '../public/styles.css';
import '../public/nprogress.css'
import { parseCookies, destroyCookie } from 'nookies'
import { redirectUser } from '../utils/auth'
import baseURL from '../utils//baseUrl'
import axios from 'axios'
import { Router } from "next/router";

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {

    const { token } = parseCookies(ctx);
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (!token) {
      const isProtectedRoute = ctx.pathname === '/account' || ctx.pathname === '/create'
      if (isProtectedRoute) {
        redirectUser(ctx, '/login')
      }
    }
    else {
      try {

        const isProtectedRoute = ctx.pathname === '/login' || ctx.pathname === '/signup'
        if (isProtectedRoute) {
          redirectUser(ctx, '/')
        }

        const payload = { headers: { authorization: token } };
        const url = `${baseURL}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;

        const isRoot = user.role === 'root';
        const isAdmin = user.role === 'admin';

        if (!(isRoot || isAdmin) && ctx.pathname === 'create') {
          redirectUser(ctx, '/');
        }

        pageProps.user = user;
      }
      catch (err) {
        console.error("Error getting current user", err);
        destroyCookie(ctx, "token");
        redirectUser(ctx, "/login")
      }
    }

    return { pageProps: pageProps }
  }

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout)
  }

  syncLogout = event => {
    if (event.key === 'logout') {
      console.log("Logged out from storage.")
      Router.push('/')
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    )
  }
}

export default MyApp;
