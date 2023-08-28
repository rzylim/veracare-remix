import type {
  ActionArgs,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
// import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession } from "~/utils/session.server";
import { simulateFetch } from "~/utils/simulate-network.server";

import type { User } from "types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  const description = "Login to submit your own jokes to Remix Jokes!";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Jokes | Login" },
  ];
};

function validateUsername(username: string) {
  if (username.length < 3) {
    return "Usernames must be at least 3 characters long";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

// placeholder user data.
const testUser: User = {
  uid: "u5uid",
  name: `name-of-u5`,
  alias: `alias-of-u5`,
  profilePicture: "https://picsum.photos/200",
  languages: ["English"],
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      // const user =  await fetch({ ...request, url: "verabackend.com/login" });
      const user = await simulateFetch(
        username === testUser.uid ? testUser : null
      );
      // const user = await login({ username, password });
      // console.log({ user });
      if (!user) {
        // KIV just return result of fetch, other backend to handle errors?
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Username/Password combination is incorrect",
        });
      }
      // KIV session to be handled by other backend?
      return createUserSession(user.uid, redirectTo);
    }
    case "register": {
      // const userExists =  await fetch({ ...request, url: "verabackend.com/register" });
      const userExists: boolean = await simulateFetch(
        username === testUser.uid
      );
      // const userExists = await db.user.findFirst({ where: { username } });
      if (userExists) {
        // KIV just return result of fetch, other backend to handle errors?
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      // const userExists =  await fetch({ ...request, url: "verabackend.com/register" });
      const user = await simulateFetch(testUser);
      // const user = await register({ username, password });
      if (!user) {
        // KIV just return result of fetch, other backend to handle errors?
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Something went wrong trying to create a new user.",
        });
      }
      // KIV session to be handled by other backend?
      return createUserSession(user.uid, redirectTo);
    }
    default: {
      // KIV just return result of fetch, other backend to handle errors?
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
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
      </div>
    </div>
  );
}