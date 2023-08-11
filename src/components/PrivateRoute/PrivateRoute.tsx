import {Redirect} from 'react-router-dom'

interface PrivateRouteProps {
  isAdmin: boolean;
  isAuth: boolean;
  component: React.ElementType;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuth,
  component: Component,
  ...props
}) => {
  return isAuth ? (
    <Component isAuth={isAuth} {...props} />
  ) : (
    <Redirect to='/login' />
  );
};

export default PrivateRoute;

