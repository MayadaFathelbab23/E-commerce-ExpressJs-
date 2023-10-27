const asyncHandelr = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require('../utils/apiFeatures')

exports.DeleteOne = (Model)=> 
    asyncHandelr(async (req, res, next) => {
        const { id } = req.params;
        const Document = await Model.findByIdAndDelete(id);
        if (!Document) {
          return next(new ApiError(`Document for this id ${id} not found`, 404));
        }
        // Trigger deleteOne event when delete document
        await Document.deleteOne()
        res.status(200).send();
    });

exports.UpdateOne = (Model)=> asyncHandelr(async (req , res , next)=>{
    const Document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!Document) {
      return next(new ApiError(`Document for this id ${req.params.id} not found`, 404));
    }
    // Trigger save event when update document
    Document.save();
    res.status(200).json({ data: Document });
})

exports.CreateOne = (Model)=> asyncHandelr(async (req, res) => {
  const Document = await Model.create(req.body)
  res.status(201).json({ data: Document })
}) ;

exports.getOne = (Model , populateOPT) => asyncHandelr(async (req , res , next)=>{
  const {id }= req.params;
  let query = Model.findById(id);
  if(populateOPT){
    query = query.populate(populateOPT)
  }
  // Excute query
  const Document = await query;
  if(!Document){
    return next(new ApiError("Document Not Found" ,404 ))
  }
  res.status(200).json({data : Document}) 
})

exports.getAll = (Model , modelName = ' ') => asyncHandelr(async (req , res)=>{
  let filter = {};
  if(req.filterObj){
    filter = req.filterObj
  }
  // Buid query
  const mongooseQuery = Model.find(filter);
  const coutDocs = await Model.countDocuments();
  const apiFeature = new ApiFeature(mongooseQuery , req.query)
  .filter()
  .limitFields()
  .paginate(coutDocs)
  .sorting()
  .search(modelName);

  // Excute Query
  const {paginattionResult} = apiFeature;
  const allDocuments = await apiFeature.mongooseQuery;
  res.status(200).json({results :allDocuments.length , paginattionResult , data : allDocuments})

})