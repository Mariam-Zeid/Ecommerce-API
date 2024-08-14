export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  paginate() {
    let { page, limit } = this.queryData;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    return this;
  }
  sort() {
    let { sort } = this.queryData;
    sort = sort?.replaceAll(",", " ");
    this.mongooseQuery = this.mongooseQuery.sort(sort);
    return this;
  }
  select() {
    let { select } = this.queryData;
    select = select?.replaceAll(",", " ");
    this.mongooseQuery = this.mongooseQuery.select(select);
    return this;
  }
  filter() {
    let { page, limit, sort, select, ...filter } = this.queryData;
    filter = JSON.parse(
      JSON.stringify(filter).replace(
        /gt | lt | gte | lte/g,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery = this.mongooseQuery.find(filter);
    return this;
  }
}
