import React from 'react';
import Header from './Header'
import Footer from './Footer'
import { Container } from 'semantic-ui-react';

const Layout = (props) => {
  return (
      <>
        <Header/>
        <Container>
            {props.children}
        </Container>
        <Footer/>
      </>
  );
};

export default Layout;
