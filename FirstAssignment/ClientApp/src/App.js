import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './trycomponents/Layout';
import { Home } from './trycomponents/Home';
import { Customer } from './trycomponents/Customer';
import { Product } from './trycomponents/Product';
import { Store } from './trycomponents/Store';
import { Sale } from './trycomponents/Sale';

//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/customer' component={Customer} />
        <Route path='/product' component={Product} />
        <Route path='/store' component={Store} />
        <Route path='/sale' component={Sale} />
      </Layout>
    );
  }
}
