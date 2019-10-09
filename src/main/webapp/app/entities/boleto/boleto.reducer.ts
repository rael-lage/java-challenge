import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBoleto, defaultValue } from 'app/shared/model/boleto.model';

export const ACTION_TYPES = {
  FETCH_BOLETO_LIST: 'boleto/FETCH_BOLETO_LIST',
  FETCH_BOLETO: 'boleto/FETCH_BOLETO',
  CREATE_BOLETO: 'boleto/CREATE_BOLETO',
  UPDATE_BOLETO: 'boleto/UPDATE_BOLETO',
  DELETE_BOLETO: 'boleto/DELETE_BOLETO',
  RESET: 'boleto/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBoleto>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type BoletoState = Readonly<typeof initialState>;

// Reducer

export default (state: BoletoState = initialState, action): BoletoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BOLETO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BOLETO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BOLETO):
    case REQUEST(ACTION_TYPES.UPDATE_BOLETO):
    case REQUEST(ACTION_TYPES.DELETE_BOLETO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BOLETO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BOLETO):
    case FAILURE(ACTION_TYPES.CREATE_BOLETO):
    case FAILURE(ACTION_TYPES.UPDATE_BOLETO):
    case FAILURE(ACTION_TYPES.DELETE_BOLETO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOLETO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOLETO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BOLETO):
    case SUCCESS(ACTION_TYPES.UPDATE_BOLETO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BOLETO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/boletos';

// Actions

export const getEntities: ICrudGetAllAction<IBoleto> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BOLETO_LIST,
  payload: axios.get<IBoleto>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IBoleto> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BOLETO,
    payload: axios.get<IBoleto>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBoleto> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BOLETO,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBoleto> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BOLETO,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBoleto> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BOLETO,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
