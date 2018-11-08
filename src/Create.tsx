// @ts-ignore
import useFetch from 'fetch-suspense';
import * as React from 'react';
// @ts-ignore
import { Suspense } from 'react';
import { useReducer } from 'react';
import { Alert, Button, Input } from 'reactstrap';
import * as sjcl from 'sjcl';

type Action =
  | {
      type: 'SECRET_UPDATE';
      value: string;
    }
  | {
      type: 'PAYLOAD_UPDATE';
      value: string;
    }
  | {
      type: 'CLEAR_ERROR';
    }
  | {
      type: 'SUBMIT_SECRET';
    };

interface State {
  secret: string;
  payload: string;
  errorMessage: string;
  password?: string;
  loading: boolean;
}

const Create = () => {
  const [state, dispatch] = useReducer<State, Action>(reducer, {
    errorMessage: 'dsfsdf',
    loading: false,
    payload: '',
    secret: '',
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

const reducer = (state: State, action: Action): State => {
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
  }
};

const CreateResult = (
  props: { readonly payload: string } & React.HTMLAttributes<HTMLElement>,
) => {
  const data = useFetch('https://api.yopass.se/secret', {
    body: JSON.stringify({
      expiration: parseInt('3600', 10),
      secret: props.payload,
    }),
    method: 'POST',
  });
  return <h1 {...props}>{data}</h1>;
};

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
