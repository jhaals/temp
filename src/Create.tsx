import * as React from 'react';
import { Button, Input, Alert } from 'reactstrap';

export default class Create extends React.Component {
  constructor(props: any) {
    super(props);
  }

  readonly state = { secret: '', lifetime: '3600', errorMessage: '' };

  public render() {
    return (
      <div>
        {this.state.errorMessage ? (
          <Error
            message={this.state.errorMessage}
            //onClick={this.dismissError}
          />
        ) : null}
        <Input type="textarea" name="foobar" onChange={this.handleChange} />
        <Button color="primary" onClick={this.submitSecret}>
          hello
        </Button>
      </div>
    );
  }
  readonly dismissError = (event: any) => {
    this.setState({ errorMessage: '' });
  };
  readonly submitSecret = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.secret === '') return;
    this.setState({ errorMessage: 'foobarb' });
  };

  readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ secret: event.target.value });
  };
}

const Error = (props: { readonly message: string }) => (
  <Alert color="danger">{props.message}</Alert>
);
