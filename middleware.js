import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // redirect here if unauthenticated
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*","/learn","/interface"],
};
