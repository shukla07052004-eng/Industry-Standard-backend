import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { //this file is inside multer in which file get uploaded
    cb(null, './public/temp') // cb(error, path)
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalName)
  }
})

export const upload = multer({ 
    storage: storage 
})