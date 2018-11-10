import * as React from 'react';
// @ts-ignore
import { Suspense } from 'react';
import { useReducer } from 'react';
import { Alert, Button, Input } from 'reactstrap';
import * as sjcl from 'sjcl';
import Result from './Result';

type Action =
  | {
      type: 'SECRET_UPDATE';
      value: string;
    }
  | {
      type: 'ERROR_CLEAR';
    }
  | {
      type: 'LOADING';
      isLoading: boolean;
    }
  | {
      type: 'ERROR_SET';
      error: string;
    }
  | {
      type: 'DISPLAY_RESULT';
      uuid: string;
      password: string;
    };

interface State {
  secret: string;
  errorMessage: string;
  password: string;
  loading: boolean;
  uuid: string;
  backendDomain: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SECRET_UPDATE':
      return {
        ...state,
        secret: action.value,
      };
    case 'DISPLAY_RESULT':
      return {
        ...state,
        password: action.password,
        uuid: action.uuid,
      };
    case 'LOADING':
      return {
        ...state,
        loading: action.isLoading,
      };
    case 'ERROR_CLEAR':
      return {
        ...state,
        errorMessage: '',
      };
    case 'ERROR_SET':
      return {
        ...state,
        errorMessage: action.error,
      };
  }
};

const Create = () => {
  // const [secret, setSecret] = useState('');
  const [state, dispatch] = useReducer<State, Action>(reducer, {
    backendDomain: 'http://localhost:1337',
    errorMessage: '',
    loading: false,
    password: '',
    secret: '',
    uuid: '',
  });

  const submit = async () => {
    if (state.secret === '') {
      return;
    }
    // Dispatch loading
    dispatch({ type: 'LOADING', isLoading: true });
    try {
      const pw = randomString();
      const request = await fetch(`${state.backendDomain}/secret`, {
        body: JSON.stringify({
          expiration: parseInt('3600', 10),
          secret: sjcl.encrypt(pw, state.secret).toString(),
        }),
        method: 'POST',
      });
      const data = await request.json();
      dispatch({
        password: pw,
        type: 'DISPLAY_RESULT',
        uuid: data.message,
      });
    } catch (e) {
      dispatch({ type: 'ERROR_SET', error: e.message });
    }
    dispatch({ type: 'LOADING', isLoading: false });
  };

  const Form = () => {
    return (
      <div>
        <Input
          type="textarea"
          name="secret"
          onChange={e =>
            dispatch({ type: 'SECRET_UPDATE', value: e.target.value })
          }
          value={state.secret}
        />
        <Button onClick={() => submit()} color="primary">
          Encrypt Message
        </Button>
      </div>
    );
  };

  return (
    <div>
      <Error
        message={state.errorMessage}
        onClick={() => dispatch({ type: 'ERROR_CLEAR' })}
      />
      <Loading show={state.loading} />
      {state.uuid ? (
        <Result uuid={state.uuid} password={state.password} />
      ) : (
        <Form />
      )}
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

const randomString = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default Create;
