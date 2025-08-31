
const School = require('../models/SchoolModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/schools';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'school-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  }
});

class SchoolController {
 
  static async createSchool(req, res) {
    try {
      
      let imageValue = null;
      if (req.file) {
        imageValue = req.file.filename;
      } else if (req.body.image && typeof req.body.image === 'string') {
        imageValue = req.body.image;
      }

      const schoolData = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        contact: req.body.contact,
        email_id: req.body.email_id,
        image: imageValue
      };

      const school = await School.create(schoolData);

      res.status(201).json({
        success: true,
        message: 'School created successfully',
        data: school
      });
    } catch (error) {
      
      if (error.message.includes('Validation Error')) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: error.message.replace('Validation Error: ', '')
        });
      }

      
      if (error.message.includes('email already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          error: error.message
        });
      }

      console.error('Error creating school:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to create school'
      });
    }
  }

static async getAllSchools(req, res) {
  try {
    const schools = await School.findAll();
    res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
      data: schools
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "Failed to fetch schools"
    });
  }
}

  
  static async getSchoolById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID',
          error: 'School ID must be a valid number'
        });
      }

      const school = await School.findById(id);

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
          error: `No school found with ID: ${id}`
        });
      }

      res.status(200).json({
        success: true,
        message: 'School retrieved successfully',
        data: school
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to fetch school'
      });
    }
  }

  static async updateSchool(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID',
          error: 'School ID must be a valid number'
        });
      }

      const updateData = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        contact: req.body.contact,
        email_id: req.body.email_id,
        image: req.file ? req.file.filename : req.body.image
      };

      const school = await School.updateById(id, updateData);

      res.status(200).json({
        success: true,
        message: 'School updated successfully',
        data: school
      });
    } catch (error) {
      if (error.message.includes('Validation Error')) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: error.message.replace('Validation Error: ', '')
        });
      }

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
          error: error.message
        });
      }

      if (error.message.includes('email already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          error: error.message
        });
      }

      console.error('Error updating school:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to update school'
      });
    }
  }

  static async deleteSchool(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID',
          error: 'School ID must be a valid number'
        });
      }

      const deleted = await School.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
          error: `No school found with ID: ${id}`
        });
      }

      res.status(200).json({
        success: true,
        message: 'School deleted successfully',
        data: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to delete school'
      });
    }
  }

 
  static async getSchoolsByCity(req, res) {
    try {
      const { city } = req.params;

      if (!city || city.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city name',
          error: 'City name must be at least 2 characters long'
        });
      }

      const schools = await School.findByCity(city.trim());

      res.status(200).json({
        success: true,
        message: `Schools in ${city} retrieved successfully`,
        data: schools,
        count: schools.length
      });
    } catch (error) {
      console.error('Error fetching schools by city:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to fetch schools by city'
      });
    }
  }

  
  static async getSchoolsByState(req, res) {
    try {
      const { state } = req.params;

      if (!state || state.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Invalid state name',
          error: 'State name must be at least 2 characters long'
        });
      }

      const schools = await School.findByState(state.trim());

      res.status(200).json({
        success: true,
        message: `Schools in ${state} retrieved successfully`,
        data: schools,
        count: schools.length
      });
    } catch (error) {
      console.error('Error fetching schools by state:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Failed to fetch schools by state'
      });
    }
  }
}


module.exports = {
  SchoolController,
  uploadMiddleware: upload.single('image')
};