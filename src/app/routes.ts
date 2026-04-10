import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { PastoralCare } from "./pages/pastoral-care";
import { Giving } from "./pages/giving";
import { Members } from "./pages/members";
import { MemberProfile } from "./pages/member-profile";
import { Schedule } from "./pages/schedule";
import { SettingsPage } from "./pages/settings";
import { MinistryPage } from "./pages/ministry";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pastoral-care", Component: PastoralCare },
      { path: "giving", Component: Giving },
      { path: "members", Component: Members },
      { path: "members/:id", Component: MemberProfile },
      { path: "schedule", Component: Schedule },
      { path: "ministry", Component: MinistryPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
