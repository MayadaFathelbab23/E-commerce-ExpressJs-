const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const ApiError = require("../utils/apiError");

const memoryMulter = ()=>{
  // 2- Memory storage configration
  const myStorage = multer.memoryStorage();
  // file filteration
  const filter = (req, file, cb) => {
    // mimtype => image/jpeg
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed to upload", 400), false);
    }
  };
  const upload = multer({ storage: myStorage, fileFilter: filter });
  return upload;
}
exports.uploadSingleDiskImage = (fieldName)=>{
    // disk storage configration
    const myStorage = multer.diskStorage({
        destination : (req , file , cb)=>{
            cb(null , "uploads/category");
        },
        filename : (req , file , cb)=>{
            // category-id-date.jpeg
            const ext = file.mimetype.split("/")[1];
            const fName = `category-${uuidv4()}-${Date.now()}.${ext}`;
            cb(null , fName);
        }
    })
    // // file filteration
    const filter = (req , file , cb)=>{
        // mimtype => image/jpeg
        if(file.mimetype.startsWith("image")){
            cb(null , true);
        }else{
            cb(new ApiError("Only images are allowed to upload" , 400) , false);
        }
    }
    const upload = multer({storage : myStorage , fileFilter : filter})
    return upload.single(fieldName);
}

 // upload single file middleware
exports.uploadSingleMemoryImage = (fieldName) => memoryMulter().single(fieldName)


exports.uploadMixMemortImages = (singlsField , multipleFields)=>
    memoryMulter().fields([
      {
          name : singlsField,
          maxCount : 1
      },
      {
          name : multipleFields,
          maxCount : 5
      }
  ])
