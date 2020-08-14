import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

function NavigationBar() {

    return (
        <Menu fixed="top" inverted>
            <Menu.Item name='React' href="/"/>
            <Menu.Item name='Customer' href="/Customer"/>
            <Menu.Item name='Product' href="/Product"/>
            <Menu.Item name='Sale' href="/Sale"/>
            <Menu.Item name='Store' href="/Store"/>
        </Menu>
    )
}

export default NavigationBar;