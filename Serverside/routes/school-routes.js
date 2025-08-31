
const express = require('express');
const multer = require('multer');
const { SchoolController, uploadMiddleware } = require('../controllers/SchoolController.js');
const { regenerateDescription } = require('../config/geminiClient.js');

const router = express.Router();

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'Image size should not exceed 5MB'
      });
    }
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type',
      error: 'Only image files are allowed'
    });
  }

  next(err);
};


router.post('/add', uploadMiddleware, handleUploadError, SchoolController.createSchool);


router.get('/getschools', SchoolController.getAllSchools);


router.get('/get/:id', SchoolController.getSchoolById);

router.put('/:id', uploadMiddleware, handleUploadError, SchoolController.updateSchool);


router.delete('/:id', SchoolController.deleteSchool);


router.get('/city/:city', SchoolController.getSchoolsByCity);


router.get('/state/:state', SchoolController.getSchoolsByState);

router.post('/:id/regenerate-description',regenerateDescription );


module.exports = router;