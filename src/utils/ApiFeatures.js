export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }
  pagination() {
    // skip refers to the what that shown up
    // limit refers to how many thing to be shown
    if (this.searchQuery <= 0) this.searchQuery = 1;
    const pageNumber = this.searchQuery * 1 || 1;
    // so we power it with one so if it NaN it will get back the false result
    // to get the optional number which is one and that we handle anything not a number
    const pageLimit = 6;
    const skip = (pageNumber - 1) * pageLimit;
    // const 2 =      1     *   2
    // const 0 =  (1 - 1)   *   2  => so we able to skip nothing at the first page
    // const 2 =  (2 - 1)   *   2  => so we able to skip 2 at the second page
    // because we already shown the first two products
    this.pageNumber = pageNumber;
    this.mongooseQuery.skip(skip).limit(pageLimit);
    return this;
    // we did this so we able can do function chain
  }
  // ==============filtration==============
  filter() {
    let filterObj = { ...this.searchQuery };
    // we did this so we be able to a shallow copy
    // because if we change, we don't change the real thing
    // so if we change the real thing, we don't change the shallow copy
    const excludedFields = ["page", "sor", "fields", "keyword"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });
    // we use it for
    // fields: "-__v" => means we exclude __v from showing in our response
    // or not shown in our filter and don't mixed it up with other things
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(lte|lt|gt|gte)/g, (match) => `$${match}`);
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }
  sort() {
    if (this.searchQuery.sort) {
      const sortBy = this.searchQuery.sort().split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }
  fields() {
    if (this.searchQuery.fields) {
      let fields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  search() {
    if (this.searchQuery.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.searchQuery.keyword } },
          { description: { $regex: this.searchQuery.keyword } },
        ],
      });
    }
    return this;
  }
  populate() {}
  sortFields() {}
  searchFields() {}
  populateFields() {}
  selectedFields() {}
}
