export const getLifecycleQuery = (status) => {
  const now = new Date();

  switch (status) {
    case 'active':
      return { startAt: { $lte: now }, expiresAt: { $gte: now } };
    case 'upcoming':
      return { startAt: { $gt: now } };
    case 'closed':
      return { expiresAt: { $lt: now } };
    default:
      return {};
  }
};
