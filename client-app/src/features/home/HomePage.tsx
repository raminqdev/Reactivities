import { observer } from 'mobx-react-lite';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Header, Image, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign='center' vertical className='masthead' >
      <Container text>
        <Header as='h1' inverted >
          <Image size='massive' src='/assets/logo.png'
            alt='logo' style={{ marginBottom: 12 }} />
            Home Page
        </Header>
        {userStore.isLoggedIn ?
          (
            <>
              <Header as='h2' inverted>Reactivities</Header>
              <Button as={Link} to={'/activities'} size='huge' inverted>
                Go to Avtivities !
              </Button>
            </>
          ) :
          (
            <>
              <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                Login!
              </Button>
              <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                Register!
              </Button>
              <Divider horizontal inverted>Or</Divider>
              {/* <GoogleLogin
                clientId="ac164us866id6vaq1t.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              ></GoogleLogin> */}
            </>
          )
        }
      </Container>
    </Segment>
  )
})
