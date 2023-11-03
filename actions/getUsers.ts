import { db } from "@/lib/db";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
