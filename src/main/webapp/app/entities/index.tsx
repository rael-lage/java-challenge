import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Client from './client';
import Buyer from './buyer';
import Payment from './payment';
import Card from './card';
import Boleto from './boleto';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/client`} component={Client} />
      <ErrorBoundaryRoute path={`${match.url}/buyer`} component={Buyer} />
      <ErrorBoundaryRoute path={`${match.url}/payment`} component={Payment} />
      <ErrorBoundaryRoute path={`${match.url}/card`} component={Card} />
      <ErrorBoundaryRoute path={`${match.url}/boleto`} component={Boleto} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
