import { destroyCookie, parseCookies, setCookie } from "nookies";
const cookie = parseCookies();

export const createCookie = (
  accessToken: string,
  refreshToken: string,
  ctx?: any
) => {
  setCookie(ctx, "accessToken", accessToken, {
    path: "/",
    maxAge: 3600,
  });
  setCookie(ctx, "refreshToken", refreshToken, {
    path: "/",
    maxAge: 3600,
  });
};

export const deleteCookie = (ctx?: any) => {
  if (!cookie) {
    console.log("cookie doesnt exist!");
  }
  destroyCookie(ctx, "accessToken", { path: "/" });
  destroyCookie(ctx, "refreshToken", { path: "/" });
};
