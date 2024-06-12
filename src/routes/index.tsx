import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import is from 'date-fns/esm/locale/is/index.js';
import { pageRoutes } from './PageRoutes';
import { landingRoutes } from './LandingRoutes';

const supportedLangList = ["en", "zh-HK", "zh-CN"];

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages


const Login = Loader(lazy(() => import('src/content/login')));


// Applications

const Messenger = Loader(
  lazy(() => import('src/content/applications/Messenger'))
);
const Transactions = Loader(
  lazy(() => import('src/content/applications/Transactions'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);



// Status

function applyMultiLang(routes: RouteObject[]){
  //return routes;

  return supportedLangList.flatMap((lang) => {
    var newRoutes = [];
    
    routes.forEach((route) => {
      var newRoute = {...route};
      newRoute.path = `/${lang}`;

      newRoutes.push(newRoute);
    });

    return newRoutes;
  });
}
export default landingRoutes.concat(applyMultiLang(pageRoutes));
