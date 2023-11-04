import { db } from "./db";

interface getUserSubscriptionPlanProps {
  userId: string;
}

export const getUserSubscriptionPlan = async ({
  userId,
}: getUserSubscriptionPlanProps) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return "User with this Id not found";
  }
  const plan = user?.userType;
  return plan;
};
