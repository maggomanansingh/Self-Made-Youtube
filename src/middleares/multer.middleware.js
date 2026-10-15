import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/temp")
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname) // just for development we have to update the naming system as concern about naming and file upload
  }
})

export const upload = multer({ storage: storage })
