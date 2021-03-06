import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { config } from './consts';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import ShowFiles from './pages/ShowFiles';
import Help from './pages/Help';
import Metrics from './pages/Metrics';


// ----------------------------------------------------------------------

const Element = ({as, include}) => {

}

export default function Router(props) {
  if (!props.token) {
    return useRoutes([
      {
        path: "*", element: <Login />
      }
    ])
  }

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'files', element: <ShowFiles />},
        { path: 'help', element: <Help />},
        { path: 'metrics', element: <Metrics />},
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ].filter(r => r));
}
