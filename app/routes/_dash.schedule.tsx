import { useState } from "react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useLongPress } from "use-long-press";

import { createScheduledTasks } from "~/utils/task-converters";
import { mapDayOfWeekString } from "~/utils/date-time";

import type { ScheduledTask } from "types";

import stylesUrl from "~/styles/schedule.css";

import { simulateFetch } from "~/utils/simulate-network.server";
import { testSchedule } from "~/placeholder-data/schedule";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

const locale = "en-SG";
const timeConfig: Parameters<Date["toLocaleTimeString"]> = [
  locale,
  {
    // timeZoneName: 'short', // display the abbreviated time zone name
    // weekday: 'long', // display the full day of the week name
    // year: 'numeric',
    // month: '2-digit',
    // day: '2-digit',
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    // second: 'numeric',
  },
];

function AgendaItem({ item }: { item: ScheduledTask }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const { eid, startTime, endTime, facility, task_name, residents } = item;

  const startTimeString = startTime.toLocaleTimeString(...timeConfig);
  const endTimeString = endTime.toLocaleTimeString(...timeConfig);
  const dayOfWeekString = mapDayOfWeekString[startTime.getDay()];
  const dateString = startTime.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bindLongPress = useLongPress(() => {
    setMenuVisible(!menuVisible);
  });

  return (
    <div className="agenda-item" {...bindLongPress()}>
      <div className="time-location">
        <h2>{`${startTimeString} - ${endTimeString}`}</h2>
        <p>{`${dayOfWeekString}\n${dateString}`}</p>
        <p>{facility}</p>
      </div>
      <div className="task-details-actions">
        <div className="task-details">
          <h2>{task_name}</h2>
          {!residents?.length ? null : residents.length === 1 ? (
            // show full details for single resident.
            <div>
              <div>{`${residents[0].name} (a.k.a ${residents[0].alias}), ${residents[0].room}`}</div>
              <div>{`Allergies: ${residents[0].allergies.join(", ")}`}</div>
              <div>{`Languages: ${residents[0].languages.join(", ")}`}</div>
            </div>
          ) : (
            // show list of residents for group events.
            <div>{residents?.map((user) => user.name).join(", ")}</div>
          )}
        </div>
        {menuVisible && (
          <div className="task-actions-container">
            <div>Cancel</div>
            <div>Complete</div>
            <div>Extend 30 mins</div>
          </div>
        )}
      </div>
    </div>
  );
}

export const loader = async ({ request }: LoaderArgs) => {
  // const scheduleArr =  await fetch({ ...request, url: "verabackend.com/schedule" });
  const scheduleArr = await simulateFetch(testSchedule);

  return json(scheduleArr);
};

export default function ScheduleRoute() {
  const data = useLoaderData<typeof loader>();
  const schedule = createScheduledTasks(data);

  return (
    <div className="container">
      {Object.values(schedule).map((item) => (
        <AgendaItem item={item} key={item.eid} />
      ))}
      {/* <div className="content" data-light="">
        <h1>Login</h1>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div> */}
    </div>
  );
}
