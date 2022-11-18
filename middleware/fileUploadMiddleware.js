import multer from "multer";

const fileStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads/");
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStorage }).single("attachment");

const fileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(200).send({ success: false, message: "Upload Error!" });
    } else {
      let uploadPath = req.file.path;
      let fileUrl = uploadPath.replace(/\\/g, "/");
      req.body.filePath = fileUrl;

      let fileNameList = fileUrl.split("/");
      req.body.fName = fileNameList[1];
      next();
    }
  });
};

export { fileUpload };
