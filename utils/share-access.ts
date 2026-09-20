type SharedCalculationAccess = {
  expiresAt: Date | null;
  isPublic: boolean;
  userId: string | null;
};

type ShareAccessOptions = {
  currentUserId?: string | null;
  now?: Date;
};

export const shouldHideSharedCalculation = (
  sharedCalculation: SharedCalculationAccess | null | undefined,
  { currentUserId = null, now = new Date() }: ShareAccessOptions = {},
) => {
  if (!sharedCalculation) return true;
  if (sharedCalculation.expiresAt && sharedCalculation.expiresAt < now) return true;
  return !sharedCalculation.isPublic && sharedCalculation.userId !== currentUserId;
};
