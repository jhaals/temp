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
        <Error message={this.state.errorMessage} onClick={this.dismissError} />
        <Input type="textarea" name="foobar" onChange={this.handleChange} />
        <Button color="primary" onClick={this.submitSecret}>
          hello
        </Button>
      </div>
    );
  }
  readonly dismissError = () => {
    this.setState({ errorMessage: '' });
  };
  readonly submitSecret = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.secret === '') return;
    this.setState({ errorMessage: 'fail' });
  };

  readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ secret: event.target.value });
  };
}

const Error = (
  props: { readonly message: string } & React.HTMLAttributes<HTMLElement>,
) =>
  props.message ? (
    <Alert color="danger" {...props}>
      {props.message}
    </Alert>
  ) : null;
