import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-cliet";

// Using AuthOptions (v4 compatible) because NextAuthConfig type not exported in current beta.
export const authConfig: any = {
  providers: [GitHub],
  callbacks: {
    // Called on sign in attempt
    async signIn({ user, profile }: { user?: any; profile?: any }) {
      // profile.id is GitHub numeric id
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile?.id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name: user?.name,
          email: user?.email,
          image: user?.image,
          bio: (profile as any)?.bio || "",
          userName: (profile as any)?.login,
        });
      }
      return true;
    },
    async jwt({
      token,
      account,
      profile,
    }: {
      token: any;
      account?: any;
      profile?: any;
    }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile?.id });
        (token as any).id = user?._id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      (session as any).id = (token as any).id;
      return session;
    },
  },
};

// Cast to any to bypass beta type mismatch if call signature not inferred
export const { handlers, signIn, signOut, auth } = (NextAuth as any)(
  authConfig
);
