import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!(credentials?.email && credentials?.password)) return null;

        let dbUser = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        console.log("credentials",credentials)
        if (!dbUser && credentials.name) {//registering
          await prisma.user.create({
            data: {
              name: credentials.name ?? "safegaurdname",
              email: credentials.email ?? "safegaurdemail",
              password: credentials.password ,
              provider: "credentials"
            }
          });
          console.log("New user created in DB");
          dbUser= await prisma.user.findUnique({where: { email: credentials.email }});
        }
        if (dbUser && dbUser.password === credentials.password) {//signIn
          return {
            id: dbUser.id.toString(),
            name: dbUser.name,
            email: dbUser.email
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      console.log("Attempting sign in for: will work", user.email , typeof(user.email));
      const dbUser= await prisma.user.findUnique({
        where: { email: user.email }
        });
      
      if (!dbUser) {
        await prisma.user.create({
          data: {
            name: user.name ?? "safegaurdname",
            email: user.email ?? "safegaurdemail",
            image: user.image ,
            provider: "google"
          }
          
        });
        console.log("New user created in DB");
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        if (dbUser) {
          session.user.id = dbUser.id.toString();
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function LoginIsRequiredServer(){
  const session = await getServerSession(authOptions);
  if(!session)return redirect("/");
}

