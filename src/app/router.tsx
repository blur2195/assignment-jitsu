import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "layout";
import { PATH_ROUTES } from "config";
import { Assignments, Shipments } from "features";

export const Router = () => useRoutes([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={PATH_ROUTES.SHIPMENTS} replace />,
      },
      {
        path: PATH_ROUTES.SHIPMENTS,
        element: <Shipments />,
      },
      {
        path: PATH_ROUTES.ASSIGNMENTS,
        element: <Assignments />,
      }
    ],
  }
]);
