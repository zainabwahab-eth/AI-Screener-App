const qs = require("qs");

class JobSearch {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Transform query object to handle nested operators (e.g., minSalary[lt])
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
        // Add the operator and value (convert to number if needed)
        transformedQuery[field][mongoOperator] = isNaN(value)
          ? value
          : Number(value);
      } else {
        // Handle non-operator fields directly
        transformedQuery[key] = isNaN(value) ? value : Number(value);
      }
    }

    // Apply the transformed query to the MongoDB query
    this.query = this.query.find(transformedQuery);
    console.log("Transformed Query:", JSON.stringify(transformedQuery));
    return this;

    // // Convert query string operators to MongoDB operators
    // let queryStr = JSON.stringify(queryObj);

    // // Fix the regex replacement to properly handle nested operators
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // // Parse the modified query string
    // const parsedQuery = JSON.parse(queryStr);

    // // Handle special cases where operators might be nested in object keys
    // const mongoQuery = {};
    // for (const key in parsedQuery) {
    //   if (key.includes("[") && key.includes("]")) {
    //     // Handle bracket notation (minSalary[lt])
    //     const field = key.split("[")[0];
    //     const operator = key.split("[")[1].replace("]", "");
    //     mongoQuery[field] = { [`${operator}`]: parsedQuery[key] };
    //   } else {
    //     mongoQuery[key] = parsedQuery[key];
    //   }
    // }

    // this.query = this.query.find(mongoQuery);
    // console.log("Final MongoDB Query:", mongoQuery);
    // return this;
  }

  //{"price":{"$lt":"1000"}}

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
