// import { getCookie, setCookie } from "cookies-next";

// export function getUserFromCookies() {
//   const email = getCookie("email");
//   const id = getCookie("userId");
//   if (email && id) {
//     return { email: email as string, id: id as string };
//   }
//   return null;
// }

// export function setUserCookie(email: string, id: string, username: string) {
//   setCookie("email", email, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     httpOnly: true,
//   });
//   setCookie("userId", id, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     httpOnly: true,
//   });
//   setCookie("username", username, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     httpOnly: true,
//   });
// }
