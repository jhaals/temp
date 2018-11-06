import * as React from 'react';
import { useEffect, useState } from 'react';

const CreateResult = (
  props: { readonly payload: string } & React.HTMLAttributes<HTMLElement>,
) => {
  const [result, setResult] = useState('');
  function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  useEffect(
    () => {
      sleep(2000).then(() => {
        fetch('https://api.yopass.se/secret', {
          body: JSON.stringify({
            expiration: parseInt('3600', 10),
            secret: props.payload,
          }),
          method: 'POST',
        }).then(r => {
          setResult(r.statusText);
        });
      });
    },
    [props.payload],
  );
  return <h1 {...props}>{result}</h1>;
};

export default CreateResult;
