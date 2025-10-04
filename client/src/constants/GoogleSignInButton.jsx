import { GoogleLogin } from '@react-oauth/google';

export default function GoogleSignInButton({ onSuccess, onError }) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="center"
        width="100%"
      />
    </div>
  );
}