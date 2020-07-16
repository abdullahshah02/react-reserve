import { Menu, Container, Icon, Image } from 'semantic-ui-react'
import Link from 'next/link'
import { SignedInLinks, SignedOutLinks } from './HeaderLinks'
import Router, { useRouter } from "next/router"
import Nprogress from 'nprogress'

Router.onRouteChangeStart = () => Nprogress.start()
Router.onRouteChangeComplete = () => Nprogress.done()
Router.onRouteChangeError = () => Nprogress.done()

function Header({ user }) {

  const router = useRouter();

  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isAdmin || isRoot;

  const links = user ? <SignedInLinks isAdmin={isRootOrAdmin} /> : <SignedOutLinks />;

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <>
      <Menu id="menu" fluid inverted borderless stackable>
        <Link href="/">
          <Menu.Item header>
            <Image size="mini" src="/logo.svg" style={{ marginRight: '1em', marginLeft: '1em' }}></Image>
            React Reserve
          </Menu.Item>
        </Link>

        {links}

      </Menu>
    </>
  )
}

export default Header;
