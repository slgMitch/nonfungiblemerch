import { Fragment } from 'react';
import ResponsiveAppBar from '../ResponsiveAppBar/ResponsiveAppBar'

function Layout(props) {

  return (
    <Fragment>
        <ResponsiveAppBar />
        <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;