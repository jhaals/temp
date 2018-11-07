import * as React from 'react';
// @ts-ignore
import { Suspense, lazy } from 'react';
import { useReducer } from 'react';
import { Alert, Button, Input } from 'reactstrap';
import * as sjcl from 'sjcl';
const CreateResult = lazy(() => import('./CreateResult'));

const Create = () => {
  const randomString = () => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'SECRET_UPDATE':
        return {
          ...state,
          secret: action.value,
        };
      case 'PAYLOAD_UPDATE':
        return {
          ...state,
          payload: action.value,
        };
      case 'CLEAR_ERROR':
        return {
          ...state,
          errorMessage: '',
        };
      case 'SUBMIT_SECRET':
        if (state.secret === '') {
          return state;
        }
        const pw = randomString();
        return {
          ...state,
          password: pw,
          payload: sjcl.encrypt(pw, state.secret).toString(),
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    secret: '',
    payload: '',
    errorMessage: 'test',
    loading: false,
  });

  return (
    <div>
      <Error
        message={state.errorMessage}
        onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
      />
      <Input
        type="textarea"
        name="secret"
        onChange={e =>
          dispatch({ type: 'SECRET_UPDATE', value: e.target.value })
        }
        value={state.secret}
      />
      <Button
        onClick={() => dispatch({ type: 'SUBMIT_SECRET' })}
        color="primary"
      >
        Encrypt Message
      </Button>
      <Loading show={state.loading} />
      {state.payload ? (
        <Suspense fallback={<Loading show={true} />}>
          <CreateResult payload={state.payload} />
        </Suspense>
      ) : null}
    </div>
  );
};

const Error = (
  props: { readonly message: string } & React.HTMLAttributes<HTMLElement>,
) =>
  props.message ? (
    <Alert color="danger" {...props}>
      {props.message}
    </Alert>
  ) : null;

const Loading = (
  props: { readonly show: boolean } & React.HTMLAttributes<HTMLElement>,
) => (props.show ? <h2>Loading</h2> : null);

export default Create;
