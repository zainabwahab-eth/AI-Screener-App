const { getOptimizedImageUrl } = require("../utils/cloudinaryHelper");

const optimizeImages = (jobs) => {
  return jobs.map((job) => {
    const logoId = job.recruiterId?.company?.logo?.cloudinary_id;
    const validLogo = logoId && logoId.includes("/");

    return {
      ...job.toObject(),
      recruiterId: {
        ...job.recruiterId?.toObject?.() || job.recruiterId,
        company: {
          ...job.recruiterId?.company,
          logo: {
            ...job.recruiterId?.company?.logo,
            url: validLogo
              ? getOptimizedImageUrl(logoId, { width: 150, height: 150 })
              : "/img/company/defaultcompany.svg",
          },
        },
      },
    };
  });
};
module.exports = optimizeImages;
