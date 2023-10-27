class ApiFeature {
    constructor(mongooseQuery , queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString
    }

    filter(){
      const queryStrObj = { ...this.queryString };
      const excludQueries = ["page", "limit", "sort", "fields"];
      excludQueries.forEach((element) => {
        delete queryStrObj[element];
      });
      // {price : {$gte : 50} , ratingsAverage : {$gte : 3.5}} monogo filter formate
      let queryStr = JSON.stringify(queryStrObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
      return this;
    }

    paginate(docs){
        const page = this.queryString.page * 1;
        const limit = this.queryString.limit * 1;
        const skip = (page - 1) * limit ;
        const paginattion = {};
        const lastIdx = page * limit ;
        paginattion.currentPage = page ;
        paginattion.limit = limit ; 
        paginattion.numberOfPages = Math.ceil(docs / limit) ;
        if(lastIdx < docs){
            paginattion.next = page + 1;
        }
        if(skip > 0){
            paginattion.prev = page - 1;
        }
        this.paginattionResult = paginattion;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
    
    sorting(){
        if(this.queryString.sort){
            // price , sold => [price , sold] => price sold
            const sortBy = this.queryString.sort.split(",").join(" "); 
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        }else{
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')    
        }
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(",").join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields)
        }else{
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(ModelName){
        if(this.queryString.keyword){
            let query = {};
            if(ModelName === 'Product'){
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                  ];
            }else{
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
            }
            
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this;
    }
}

module.exports = ApiFeature;