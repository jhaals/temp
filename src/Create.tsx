import * as React from 'react';
// @ts-ignore
import { Suspense } from 'react';
import { useReducer, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';
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
  const [expiration, setExpiration] = useState('3600');
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
    dispatch({ type: 'LOADING', isLoading: true });
    try {
      const pw = randomString();
      const request = await fetch(`${state.backendDomain}/secret`, {
        body: JSON.stringify({
          expiration: parseInt(expiration, 10),
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

  return (
    <div>
      <h1>Encrypt message</h1>
      <Error
        message={state.errorMessage}
        onClick={() => dispatch({ type: 'ERROR_CLEAR' })}
      />
      {state.uuid ? (
        <Result uuid={state.uuid} password={state.password} />
      ) : (
        <Form>
          <FormGroup>
            <Label for="exampleText">Secret message</Label>
            <Input
              type="textarea"
              name="secret"
              rows="4"
              autoFocus={true}
              placeholder="Message to encrypt locally in your browser"
              onChange={e =>
                dispatch({ type: 'SECRET_UPDATE', value: e.target.value })
              }
              value={state.secret}
            />
          </FormGroup>
          <FormGroup tag="fieldset">
            <Label>Lifetime</Label>
            <FormText color="muted">
              The encrypted message will be deleted automatically after
            </FormText>
            <FormGroup check={true}>
              <Label check={true}>
                <Input
                  type="radio"
                  name="1h"
                  value="3600"
                  onChange={e => setExpiration(e.target.value)}
                  checked={expiration === '3600'}
                />
                One Hour
              </Label>
            </FormGroup>
            <FormGroup check={true}>
              <Label check={true}>
                <Input
                  type="radio"
                  name="1d"
                  value="86400"
                  onChange={e => setExpiration(e.target.value)}
                  checked={expiration === '86400'}
                />
                One Day
              </Label>
            </FormGroup>
            <FormGroup check={true} disabled={true}>
              <Label check={true}>
                <Input
                  type="radio"
                  name="1w"
                  value="604800"
                  onChange={e => setExpiration(e.target.value)}
                  checked={expiration === '604800'}
                />
                One Week
              </Label>
            </FormGroup>
          </FormGroup>
          <Button
            disabled={state.loading}
            color="primary"
            size="lg"
            block={true}
            onClick={() => submit()}
          >
            {state.loading ? (
              <span>Encrypting message...</span>
            ) : (
              <span>Encrypt Message</span>
            )}
          </Button>
        </Form>
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
