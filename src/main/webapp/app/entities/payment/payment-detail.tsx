import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './payment.reducer';
import { IPayment } from 'app/shared/model/payment.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPaymentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PaymentDetail extends React.Component<IPaymentDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { paymentEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Payment [<b>{paymentEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="amount">Amount</span>
            </dt>
            <dd>{paymentEntity.amount}</dd>
            <dt>
              <span id="type">Type</span>
            </dt>
            <dd>{paymentEntity.type}</dd>
            <dt>
              <span id="status">Status</span>
            </dt>
            <dd>{paymentEntity.status}</dd>
            <dt>Client</dt>
            <dd>{paymentEntity.client ? paymentEntity.client.id : ''}</dd>
            <dt>Buyer</dt>
            <dd>{paymentEntity.buyer ? paymentEntity.buyer.id : ''}</dd>
            <dt>Card</dt>
            <dd>{paymentEntity.card ? paymentEntity.card.id : ''}</dd>
            <dt>Boleto</dt>
            <dd>{paymentEntity.boleto ? paymentEntity.boleto.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/payment" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/payment/${paymentEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ payment }: IRootState) => ({
  paymentEntity: payment.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentDetail);
