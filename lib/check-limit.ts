// import { MAX_FREE_COUNTS } from "@/constants";
import { db } from "./db";
import getCurrentUser from "@/actions/getCurrentuser";

const MAX_COUNT_FREE = 10;

export const incrementApiLimit = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const userDb = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!userDb) {
    return "User not found";
  }
  if (userDb) {
    await db.user.update({
      where: { id: userDb.id },
      data: { count: userDb.count + 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const userDb = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!userDb || userDb.count < MAX_COUNT_FREE) {
    return true;
  } else {
    return false;
  }
};

export const getUserLimitCount = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return 0;
  }

  const userDb = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userDb) {
    return 0;
  }

  return userDb.count;
};
