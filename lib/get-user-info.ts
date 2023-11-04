// import { db } from "@/lib/db";
// import { getSession } from "@auth0/nextjs-auth0";
// import { redirect } from "next/navigation";

// export const getUserInfo = async () => {
//   const session = await getSession();
//   if (!session) {
//     redirect("/");
//   }
//   const id = session?.user.sub;
//   const email = session.user.email;
//   const user = await db.user.findUnique({
//     where: {
//       email: email,
//     },
//   });
//   if (user) {
//     // check if the user has a specific authId
//     if (user.authId === "converse| not possible") {
//       // update the user with the session authId
//       const updatedUser = await db.user.update({
//         where: { email: email },
//         data: {
//           authId: session.user.sub,
//           imageUrl: session.user.imageUrl,
//         },
//       });
//       return updatedUser;
//     } else {
//       // return the user as it is
//       return user;
//     }
//   }
//   console.log(session, "SESSION SESSION");
//   console.log(id, "IDID");
//   const newUser = await db.user.create({
//     data: {
//       authId: session.user.sub,
//       name: session.user.nickname,
//       imageUrl: session.user.picture,
//       email: session.user.email,
//       userType: "FREE",
//     },
//   });
//   return newUser;
// };
import getSession from "@/actions/getSession";
import { db } from "@/lib/db";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
