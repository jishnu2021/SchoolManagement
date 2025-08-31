
const cloudinary = require('../config/cloudinary');
const School = require('../models/SchoolModel');

class ImageController {
  

  static async getImageUrl(req, res) {
    try {
      const { publicId } = req.params;
      const { 
        width, 
        height, 
        crop = 'fill', 
        quality = 'auto', 
        format = 'auto',
        effect,
        radius,
        gravity = 'center'
      } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required',
          error: 'Please provide a valid image public ID'
        });
      }

      const transformations = {
        quality,
        format,
        gravity
      };

      if (width || height) {
        transformations.width = width;
        transformations.height = height;
        transformations.crop = crop;
      }

      if (effect) {
        transformations.effect = effect;
      }

      if (radius) {
        transformations.radius = radius;
      }


      const imageUrl = cloudinary.url(publicId, transformations);

      res.status(200).json({
        success: true,
        message: 'Image URL generated successfully',
        data: {
          originalUrl: cloudinary.url(publicId),
          transformedUrl: imageUrl,
          publicId,
          transformations
        }
      });

    } catch (error) {
      console.error('Error generating image URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate image URL',
        error: error.message
      });
    }
  }

  static async getSchoolImage(req, res) {
    try {
      const { schoolId } = req.params;
      const { 
        width, 
        height, 
        crop = 'fill', 
        quality = 'auto', 
        format = 'auto',
        effect,
        radius,
        gravity = 'center'
      } = req.query;

      if (!schoolId || isNaN(schoolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID',
          error: 'School ID must be a valid number'
        });
      }

      const school = await School.findById(schoolId);

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
          error: `No school found with ID: ${schoolId}`
        });
      }

      if (!school.image) {
        return res.status(404).json({
          success: false,
          message: 'No image found',
          error: 'This school does not have an image'
        });
      }

      let publicId;
      if (school.image.includes('cloudinary')) {

        const urlParts = school.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        publicId = `school_images/${filename.split('.')[0]}`;
      } else {
        publicId = school.image;
      }


      const transformations = {
        quality,
        format,
        gravity
      };

      if (width || height) {
        transformations.width = width;
        transformations.height = height;
        transformations.crop = crop;
      }

      if (effect) {
        transformations.effect = effect;
      }

      if (radius) {
        transformations.radius = radius;
      }

      const imageUrl = cloudinary.url(publicId, transformations);

      res.status(200).json({
        success: true,
        message: 'School image URL generated successfully',
        data: {
          schoolId,
          schoolName: school.name,
          originalUrl: school.image,
          transformedUrl: imageUrl,
          publicId,
          transformations
        }
      });

    } catch (error) {
      console.error('Error getting school image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get school image',
        error: error.message
      });
    }
  }

  // Get multiple image sizes for responsive design
  static async getResponsiveImages(req, res) {
    try {
      const { publicId } = req.params;
      const { format = 'auto', quality = 'auto' } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      // Define responsive breakpoints
      const breakpoints = [
        { name: 'thumbnail', width: 150, height: 150, crop: 'fill' },
        { name: 'small', width: 300, height: 200, crop: 'fill' },
        { name: 'medium', width: 600, height: 400, crop: 'fill' },
        { name: 'large', width: 1200, height: 800, crop: 'fill' },
        { name: 'original', crop: 'limit' }
      ];

      const responsiveUrls = {};

      breakpoints.forEach(bp => {
        const transformations = {
          quality,
          format,
          crop: bp.crop
        };

        if (bp.width) transformations.width = bp.width;
        if (bp.height) transformations.height = bp.height;

        responsiveUrls[bp.name] = cloudinary.url(publicId, transformations);
      });

      res.status(200).json({
        success: true,
        message: 'Responsive image URLs generated successfully',
        data: {
          publicId,
          images: responsiveUrls
        }
      });

    } catch (error) {
      console.error('Error generating responsive images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate responsive images',
        error: error.message
      });
    }
  }

  // Get image metadata
  static async getImageMetadata(req, res) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      // Get image details from Cloudinary
      const result = await cloudinary.api.resource(publicId);

      res.status(200).json({
        success: true,
        message: 'Image metadata retrieved successfully',
        data: {
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          url: result.secure_url,
          createdAt: result.created_at,
          uploadedAt: result.uploaded_at
        }
      });

    } catch (error) {
      if (error.http_code === 404) {
        return res.status(404).json({
          success: false,
          message: 'Image not found',
          error: 'No image found with the provided public ID'
        });
      }

      console.error('Error getting image metadata:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get image metadata',
        error: error.message
      });
    }
  }

  // Proxy image (serve image directly through your server)
  static async proxyImage(req, res) {
    try {
      const { publicId } = req.params;
      const { 
        width, 
        height, 
        crop = 'fill', 
        quality = 'auto', 
        format = 'auto' 
      } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      const transformations = {
        quality,
        format,
        crop
      };

      if (width) transformations.width = width;
      if (height) transformations.height = height;

      const imageUrl = cloudinary.url(publicId, transformations);

      // Redirect to the Cloudinary URL
      res.redirect(302, imageUrl);

    } catch (error) {
      console.error('Error proxying image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to proxy image',
        error: error.message
      });
    }
  }

  // Delete image from Cloudinary
  static async deleteImage(req, res) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        res.status(200).json({
          success: true,
          message: 'Image deleted successfully',
          data: { publicId, result: result.result }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Image not found or already deleted',
          data: { publicId, result: result.result }
        });
      }

    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }
  }

  // Get all images in school_images folder
  static async getAllSchoolImages(req, res) {
    try {
      const { maxResults = 50, nextCursor } = req.query;

      const options = {
        type: 'upload',
        prefix: 'school_images/',
        max_results: parseInt(maxResults)
      };

      if (nextCursor) {
        options.next_cursor = nextCursor;
      }

      const result = await cloudinary.api.resources(options);

      const images = result.resources.map(resource => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        bytes: resource.bytes,
        createdAt: resource.created_at
      }));

      res.status(200).json({
        success: true,
        message: 'School images retrieved successfully',
        data: {
          images,
          totalCount: result.total_count,
          nextCursor: result.next_cursor || null
        }
      });

    } catch (error) {
      console.error('Error getting all school images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get school images',
        error: error.message
      });
    }
  }
}

module.exports = ImageController;