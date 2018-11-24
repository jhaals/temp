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
      type: 'DISPLAY_RESULT';
      uuid: string;
      password: string;
    };

interface State {
  secret: string;
  password: string;
  uuid: string;
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
  }
};

const Create = () => {
  const [expiration, setExpiration] = useState('3600');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_DOMAIN = 'http://localhost:1337';
  const [state, dispatch] = useReducer<State, Action>(reducer, {
    password: '',
    secret: '',
    uuid: '',
  });

  const submit = async () => {
    if (state.secret === '') {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const pw = randomString();
      const request = await fetch(`${BACKEND_DOMAIN}/secret`, {
        body: JSON.stringify({
          expiration: parseInt(expiration, 10),
          secret: sjcl.encrypt(pw, state.secret).toString(),
        }),
        method: 'POST',
      });
      const data = await request.json();
      if (request.status !== 200) {
        setError(data.message);
      } else {
        dispatch({
          password: pw,
          type: 'DISPLAY_RESULT',
          uuid: data.message,
        });
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Encrypt message</h1>
      <Error message={error} onClick={() => setError('')} />
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
            disabled={loading}
            color="primary"
            size="lg"
            block={true}
            onClick={() => submit()}
          >
            {loading ? (
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
