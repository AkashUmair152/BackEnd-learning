const multer = require("multer");
const firebaseStorage = require("multer-firebase-storage");
const firebase = require("./firebase.config");
const serviceAccount = require("../drive-601ac-firebase-adminsdk-xjz4d-5d270f8791.json");
const storage = firebaseStorage({
  credentials: firebase.credential.cert(serviceAccount),
  bucketName: "drive-601ac.appspot.com",
});

const upload = multer({
  storage: storage,
  //   limits: {
  //     fileSize: 1024 * 1024 * 5,
  //   },
});

module.exports = upload;
