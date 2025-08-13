class JobSearch {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Create a copy of the queryString
    const queryObj = { ...this.queryString };

    // Remove excluded fields
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Transform query object to handle nested operators and arrays
    const transformedQuery = {};
    for (const [key, value] of Object.entries(queryObj)) {
      // Check if the key contains an operator (e.g., minSalary[lt])
      const operatorMatch = key.match(/\[(\w+)\]/);
      if (operatorMatch) {
        const field = key.split("[")[0]; // e.g., "minSalary"
        const operator = operatorMatch[1]; // e.g., "lt"
        const mongoOperator = `$${operator}`; // e.g., "$lt"

        // Ensure the field exists in transformedQuery
        transformedQuery[field] = transformedQuery[field] || {};
        // Handle array values for $in/$nin operators
        if (["in", "nin"].includes(operator) && typeof value === "string") {
          transformedQuery[field][mongoOperator] = value.split(",");
        } else {
          // Convert to number if applicable
          transformedQuery[field][mongoOperator] = isNaN(value)
            ? value
            : Number(value);
        }
      } else {
        // Handle direct fields, supporting arrays for multi-select
        if (Array.isArray(value)) {
          transformedQuery[key] = { $in: value };
        } else {
          transformedQuery[key] = isNaN(value) ? value : Number(value);
        }
      }
    }

    // Apply the transformed query to the MongoDB query
    this.query = this.query.find(transformedQuery);
    console.log("Transformed Query:", JSON.stringify(transformedQuery));
    return this;
  }

  searchByKeyword(fields = ["title", "description", "tags"]) {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      const orConditions = fields.map((field) => ({
        [field]: { $regex: keyword, $options: "i" },
      }));
      this.query = this.query.find({ $or: orConditions });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = JobSearch;
