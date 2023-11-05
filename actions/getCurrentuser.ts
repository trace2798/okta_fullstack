import { db } from "@/lib/db";
import getSession from "./getSession";

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
    // console.log(currentUser);
    if (currentUser.hashedPassword) {
      return currentUser;
    }
    if (!currentUser.hashedPassword) {
      const userAccount = await db.account.findFirst({
        where: {
          userId: currentUser.id,
        },
      });
      // console.log(userAccount);
      if (!currentUser.authId) {
        const updateUser = await db.user.update({
          where: {
            id: userAccount?.userId,
          },
          data: {
            authId: userAccount?.providerAccountId,
          },
        });
      }
    }
    if (!currentUser.hashedPassword) {
      // If the user has both authId and orgId, set userType to ENTERPRISE
      if (
        currentUser.authId &&
        currentUser.orgId &&
        currentUser.userType !== "ENTERPRISE"
      ) {
        const updateType = await db.user.update({
          where: {
            id: currentUser.id,
          },
          data: {
            userType: "ENTERPRISE",
          },
        });
      }
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
