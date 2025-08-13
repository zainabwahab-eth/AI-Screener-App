const cron = require("node-cron");
const Job = require("./../model/jobModel");

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    const updated = await Job.updateMany(
      { expiringDate: { $lte: now }, status: "active" },
      { $set: { status: "expired" } }
    );

    console.log(`✅ ${updated.modifiedCount} jobs marked as expired.`);
  } catch (err) {
    console.error("❌ Error updating expired jobs:", err);
  }
});

module.exports = cron;
