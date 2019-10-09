import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './boleto.reducer';
import { IBoleto } from 'app/shared/model/boleto.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBoletoProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Boleto extends React.Component<IBoletoProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { boletoList, match } = this.props;
    return (
      <div>
        <h2 id="boleto-heading">
          Boletos
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Boleto
          </Link>
        </h2>
        <div className="table-responsive">
          {boletoList && boletoList.length > 0 ? (
            <Table responsive aria-describedby="boleto-heading">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Number</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {boletoList.map((boleto, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${boleto.id}`} color="link" size="sm">
                        {boleto.id}
                      </Button>
                    </td>
                    <td>{boleto.number}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${boleto.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${boleto.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${boleto.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Boletos found</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ boleto }: IRootState) => ({
  boletoList: boleto.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Boleto);
