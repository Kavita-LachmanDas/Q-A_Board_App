// import multer from 'multer';
// import path from 'path';

// // Multer config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // images will be stored in uploads folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG/PNG images are allowed!'));
//   }
// };

// export const upload = multer({ storage, fileFilter });




import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});