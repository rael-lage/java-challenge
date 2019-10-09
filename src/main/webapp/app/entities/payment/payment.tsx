import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './payment.reducer';
import { IPayment } from 'app/shared/model/payment.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPaymentProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Payment extends React.Component<IPaymentProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { paymentList, match } = this.props;
    return (
      <div>
        <h2 id="payment-heading">
          Payments
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Payment
          </Link>
        </h2>
        <div className="table-responsive">
          {paymentList && paymentList.length > 0 ? (
            <Table responsive aria-describedby="payment-heading">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Buyer</th>
                  <th>Card</th>
                  <th>Boleto</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paymentList.map((payment, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${payment.id}`} color="link" size="sm">
                        {payment.id}
                      </Button>
                    </td>
                    <td>{payment.amount}</td>
                    <td>{payment.type}</td>
                    <td>{payment.status}</td>
                    <td>{payment.client ? <Link to={`client/${payment.client.id}`}>{payment.client.id}</Link> : ''}</td>
                    <td>{payment.buyer ? <Link to={`buyer/${payment.buyer.id}`}>{payment.buyer.id}</Link> : ''}</td>
                    <td>{payment.card ? <Link to={`card/${payment.card.id}`}>{payment.card.id}</Link> : ''}</td>
                    <td>{payment.boleto ? <Link to={`boleto/${payment.boleto.id}`}>{payment.boleto.id}</Link> : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${payment.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${payment.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${payment.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Payments found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ payment }: IRootState) => ({
  paymentList: payment.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment);
