import * as React from 'react';
import { Button, Input, Alert } from 'reactstrap';
//import * as sjcl from 'sjcl';

export default class Create extends React.Component {
  constructor(props: any) {
    super(props);
  }

  readonly state = {
    secret: '',
    lifetime: '3600',
    errorMessage: '',
    password: '',
    loading: false,
  };

  public render() {
    return (
      <div>
        <Error message={this.state.errorMessage} onClick={this.dismissError} />
        <Input type="textarea" name="secret" onChange={this.handleChange} />
        <Button color="primary" onClick={this.submitSecret}>
          Encrypt Message
        </Button>
        <Loading show={this.state.loading} />
      </div>
    );
  }
  readonly dismissError = () => {
    this.setState({ errorMessage: '' });
  };
  readonly submitSecret = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.secret === '') return;
    const password = this.randomString();
    //const payload = sjcl.encrypt(password, this.state.secret);
    this.setState({ password: password });
  };

  readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  private randomString() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}

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
