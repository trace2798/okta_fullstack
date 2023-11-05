export { default } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/",
//   },
// });

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/organization/:path*",
    "/settings/:path*",
  ],
};
