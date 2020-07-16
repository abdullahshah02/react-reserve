import Link from 'next/link';
import { Menu, Icon } from 'semantic-ui-react';
import { handleLogout } from '../../utils/auth';

export function SignedInLinks({ isAdmin }) {

    return (
        <>
            <Link href="/account">
                <Menu.Item header position="right">
                    <Icon name="user" size="large"></Icon>
                    Account
                </Menu.Item>
            </Link>

            {AdminLinks(isAdmin)}

            <Link href="/cart">
                <Menu.Item header>
                    <Icon name="cart" size="large"></Icon>
                    Cart
                </Menu.Item>
            </Link>

            <Link href="/" >
                <Menu.Item header onClick={handleLogout}>
                    <Icon name="sign out" size="large"></Icon>
                    Logout
                </Menu.Item>
            </Link>
        </>
    );
}

export function SignedOutLinks() {
    return (
        <>
            <Link href="/cart">
                <Menu.Item header position="right">
                    <Icon name="cart" size="large"></Icon>
                    Cart
                </Menu.Item>
            </Link>

            <Link href="/signup">
                <Menu.Item header >
                    <Icon name="signup" size="large"></Icon>
                    Sign Up
                </Menu.Item>
            </Link>

            <Link href="/login">
                <Menu.Item header style={{ marginRight: '1em' }}>
                    <Icon name="sign in" size="large"></Icon>
                    Login
                </Menu.Item>
            </Link>
        </>
    );
}

export function AdminLinks(isAdmin) {

    if (!isAdmin)
        return null;

    return (
        <>
            <Link href="/create">
                <Menu.Item header>
                    <Icon name="add square" size="large"></Icon>
                    Create
                </Menu.Item>
            </Link>
        </>
    );
}
