import { Navigate, RouteObject } from "react-router-dom";
import { IS_SHOW_LOGIN_URL } from "src/constants";
import Landing from "src/content/applications/Landing";
import NavigateWithLocale from "src/helper/NavigateWithLocale";

export const landingRoutes: RouteObject[] = 
IS_SHOW_LOGIN_URL === "TRUE" ? [
    {
        path: '',
        element: <NavigateWithLocale to={"login"}/>
        //element: <Navigate to={"/login"}/>
    },
    {
        path: '/',
        element: <NavigateWithLocale to={"login"}/>
        //element: <Navigate to={"/login"}/>
    },
    {
        path: '/landing',
        element: <Landing />
    }
]
:
[];
