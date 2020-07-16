import React from 'react'
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import Link from 'next/link'
import catchErrors from '../utils/catchErrors'
import axios from 'axios'
import baseURL from '../utils/baseUrl'
import { handleLogin } from '../utils/auth'

const INITIAL_USER = {
  name: "",
  email: "",
  password: ""
}
function Signup() {

  const [user, setUser] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user])

  function handleChange(event) {

    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));

  }

  async function handleSubmit(event) {

    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const url = `${baseURL}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data);
    }
    catch (err) {
      const errMsg = catchErrors(err);
      console.error(errMsg)
      setError(errMsg);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Message
        attached
        icon="settings"
        header="Get Started!"
        content="Create a new account"
        color="teal"
      />
      <Form error={Boolean(error)} onSubmit={handleSubmit} loading={loading}>

        <Message
          error
          header="Oops!"
          content={error}
        />

        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            placeholder="name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="password"
            name="password"
            value={user.password}
            type="password"
            onChange={handleChange}
          />
          <Button
            disabled={loading || disabled}
            icon="signup"
            type="submit"
            color="orange"
            content="Signup"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
      Already have an account?{" "}
        <Link href='/login'>
          <a>Log in here</a>
        </Link>{" "}
      instead.
    </Message>
    </>
  )
}

export default Signup;
