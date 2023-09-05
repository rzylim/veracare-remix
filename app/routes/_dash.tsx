import type { LinksFunction } from "@remix-run/node";
import { Outlet, Link, useMatches } from "@remix-run/react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";
import stylesUrl from "~/styles/navigation.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
  { rel: "stylesheet", href: stylesUrl },
];

export default function NavBar() {
  const pathnames = useMatches().map(({ pathname }) => pathname);
  console.log(pathnames);

  return (
    <div id="_dash">
      <div id="nav">
        <h1 className="nav-logo">VeraCare</h1>
        <Link
          className={`nav-link ${
            pathnames.includes("/schedule") && "nav-active"
          }`}
          to="/schedule"
        >
          Schedule
        </Link>
        <Link
          className={`nav-link ${pathnames.includes("/add-task")}`}
          to="/add-task"
        >
          Add Task
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
