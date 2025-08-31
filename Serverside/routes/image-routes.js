
const express = require('express');
const ImageController = require('../controllers/ImageController');

const router = express.Router();

router.get('/:publicId/url', ImageController.getImageUrl);


router.get('/school/:schoolId', ImageController.getSchoolImage);


router.get('/:publicId/responsive', ImageController.getResponsiveImages);


router.get('/:publicId/metadata', ImageController.getImageMetadata);


router.get('/:publicId/proxy', ImageController.proxyImage);


router.delete('/:publicId', ImageController.deleteImage);


router.get('/schools/all', ImageController.getAllSchoolImages);

module.exports = router;