import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/index.js";
import Dashboard from "../pages/dashboard.js"
import Tracking from "../pages/tracking.js"
import TrackingPage from "../pages/tracking.js"

export const ROOT = "/";
export const DASHBOARD = "/dashboard";
export const TRACK = "/track"
export const TRACKING = "/tracking"

export const router = createBrowserRouter([
    {path: ROOT, element: <Home/>},
    {path: DASHBOARD, element: <Dashboard/>},
    {path: TRACK + "/:id", element: <Tracking/>},
    {path: TRACKING, element: <TrackingPage/>}
])