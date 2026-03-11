import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { PastoralCare } from "./pages/pastoral-care";
import { Campaigns } from "./pages/campaigns";
import { Members } from "./pages/members";
import { SettingsPage } from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pastoral-care", Component: PastoralCare },
      { path: "campaigns", Component: Campaigns },
      { path: "members", Component: Members },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
