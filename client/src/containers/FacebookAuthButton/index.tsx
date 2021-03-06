/**
 *
 * FacebookAuthButton
 *
 */

import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import useAuthUser from 'hooks/useAuthUser';
import styled from 'styled-components';
import { Button } from 'antd';
import { FacebookFilled } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { FACEBOOK_AUTH } from './gql';
import { FACEBOOK_APP_ID } from 'constants/index';

const FacebookButton = styled(Button)`
  && {
    background-color: ${p => p.theme.colors.facebook};
    border-color: ${p => p.theme.colors.facebook};

    :active {
      background-color: ${p => p.theme.colors.facebook};
      border-color: ${p => p.theme.colors.facebook};
    }

    :hover {
      background-color: ${p => p.theme.colors.facebook};
      border-color: ${p => p.theme.colors.facebook};
    }
  }
`;

interface IFacebookAuthButton {
  onSuccess?: ({ accessToken, ok }: { accessToken: string; ok: boolean }) => void;
}

export const FacebookAuthButton: React.FC<IFacebookAuthButton &
  React.HTMLAttributes<HTMLDivElement>> = ({ style, className, children, onSuccess }) => {
  const { setAuthUserToken: setAuthUser } = useAuthUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [facebookAuth, { error, data }] = useMutation(FACEBOOK_AUTH);

  React.useEffect(() => {
    if (data && data.facebookAuth && data.facebookAuth.accessToken) {
      setIsLoading(false);
      setAuthUser(data.facebookAuth.accessToken);
    }
  }, [data, setAuthUser]);

  React.useEffect(() => {
    if (error) {
      console.log('FacebookAuthButton error', error);
      setIsLoading(false);
    }
  }, [error]);

  const handleResponse = async (response: any) => {
    const { accessToken } = response;

    if (accessToken) {
      facebookAuth({
        variables: {
          accessToken,
        },
      });
      if (onSuccess) {
        onSuccess({ accessToken, ok: true });
      }
    }
  };

  const handleClick = (event: any, renderProps: any) => {
    event.preventDefault();
    renderProps.onClick(event);
    setIsLoading(true);
  };

  return (
    <FacebookLogin
      appId={FACEBOOK_APP_ID}
      autoLoad={false}
      callback={handleResponse}
      render={(renderProps: any) => (
        <FacebookButton
          style={style}
          className={className}
          icon={<FacebookFilled />}
          block
          type="primary"
          onClick={event => handleClick(event, renderProps)}
          loading={isLoading}
        >
          {children}
        </FacebookButton>
      )}
    />
  );
};

//

export default FacebookAuthButton;
