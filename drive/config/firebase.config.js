const Firebase = require("firebase-admin");

const serviceAccount = require("../drive-601ac-firebase-adminsdk-xjz4d-5d270f8791.json");
const firebase = Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  storageBucket: "drive-601ac.appspot.com",
});

module.exports = Firebase;
