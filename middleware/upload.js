const path = require ('path')
const multer = require ('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb (null, 'uploads_user/')
    },
    filename: function(req,file,cb){
       // let ext = path.extname(file.originalname)
        cb(null, Date.now() + file.originalname)
    }
})


var uploadStock = multer({
    storage: storage,
limits: {
    fileSize: 10 * 1024 * 1024
}
})

module.exports = uploadStock;