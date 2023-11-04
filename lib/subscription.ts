import getCurrentUser from "@/actions/getCurrentuser";
import { db } from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const userSubscription = await db.user.findUnique({
    where: {
      id: user.id,
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
        id: user.id,
      },
      data: {
        userType: "FREE",
      },
    });
  }
  return !!isValid;
};
