const formatJobDate = (createdAt) => {
  const now = new Date();
  const jobDate = new Date(createdAt);
  const diffInMs = now - jobDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `Posted ${diffInMinutes} minute${
      diffInMinutes === 1 ? "" : "s"
    } ago`;
  } else if (diffInHours < 24) {
    return `Posted ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays <= 2) {
    return `Posted ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  } else {
    return `Posted ${jobDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }
};

module.exports = formatJobDate