import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Boleto from './boleto';
import BoletoDetail from './boleto-detail';
import BoletoUpdate from './boleto-update';
import BoletoDeleteDialog from './boleto-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BoletoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BoletoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BoletoDetail} />
      <ErrorBoundaryRoute path={match.url} component={Boleto} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={BoletoDeleteDialog} />
  </>
);

export default Routes;
