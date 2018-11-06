import * as React from 'react';
import { useState } from 'react';
import { Alert, Button, Input } from 'reactstrap';
import * as sjcl from 'sjcl';

const Create = () => {
  const [secret, setSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [payload, setPayload] = useState('');
  const loading = false;

  const submitSecret = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (secret === '') {
      return;
    }
    setPassword(randomString());
    setPayload(sjcl.encrypt(password, secret).toString());
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

  return (
    <div>
      <Error message={errorMessage} onClick={() => setErrorMessage('')} />
      <Input
        type="textarea"
        name="secret"
        onChange={e => setSecret(e.target.value)}
        value={secret}
      />
      <Button onClick={submitSecret} color="primary">
        Encrypt Message
      </Button>
      <Loading show={loading} />
      {payload ? <CreateResult payload={payload} /> : null}
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

const CreateResult = (
  props: { readonly payload: string } & React.HTMLAttributes<HTMLElement>,
) => {
  //TODO: do fetch
  return <div>{props.payload}</div>;
};

export default Create;
