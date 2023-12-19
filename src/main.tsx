import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './tutorial/Home.tsx'
import './index.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManageUser from './tutorial/user.tsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      {
        path: "users",
        element: <ManageUser />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>,
)

