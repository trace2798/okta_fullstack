import { db } from "@/lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { getUserInfo } from "./get-user-info";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const session = await getSession();
  const user = await getUserInfo();
  if (!user) {
    return false;
  }

  const userSubscription = await db.user.findUnique({
    where: {
      authId: session?.user.sub,
      userType: "PRO",
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  if (!isValid) {
    // The subscription is expired, so change the user's type to Free
    await db.user.update({
      where: {
        authId: session?.user.sub,
      },
      data: {
        userType: "FREE",
      },
    });
  }
  return !!isValid;
};
