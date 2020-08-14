import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import NavigationBar from './Navigation';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavigationBar />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}