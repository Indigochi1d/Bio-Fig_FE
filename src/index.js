import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { createBrowserRouter,  RouterProvider } from "react-router-dom";
import ScatterWithBars from "./ScatterWithBar.js";
import SpreadSheet from "./SpreadSheet..js";
const router = createBrowserRouter([
  {
    path:'/scatter-bar-plot',
    element:<ScatterWithBars/>
  },
  {
    path:'/',
    element:<SpreadSheet/>
  }
])
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
