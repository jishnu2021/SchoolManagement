
const { pool } = require('../config/db');
const Joi = require('joi');

const schoolValidationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .trim()
    .messages({
      'string.empty': 'School name is required',
      'string.min': 'School name must be at least 2 characters long',
      'string.max': 'School name cannot exceed 255 characters',
      'any.required': 'School name is required'
    }),
  
  address: Joi.string()
    .min(5)
    .max(500)
    .required()
    .trim()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 500 characters',
      'any.required': 'Address is required'
    }),
  
  city: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 100 characters',
      'string.pattern.base': 'City should only contain letters and spaces',
      'any.required': 'City is required'
    }),
  
  state: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.empty': 'State is required',
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 100 characters',
      'string.pattern.base': 'State should only contain letters and spaces',
      'any.required': 'State is required'
    }),
  
  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.empty': 'Contact number is required',
      'string.pattern.base': 'Contact number must be exactly 10 digits',
      'any.required': 'Contact number is required'
    }),
  
  email_id: Joi.string()
    .email()
    .max(255)
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'string.max': 'Email cannot exceed 255 characters',
      'any.required': 'Email is required'
    }),
  
  image: Joi.alternatives()
    .try(
      Joi.string().max(500).allow(''),
      Joi.object(),
      Joi.any()
    )
    .optional()
    .messages({
      'string.max': 'Image URL cannot exceed 500 characters'
    })
});

class School {
  static validate(data) {
    return schoolValidationSchema.validate(data, { abortEarly: false });
  }

  static async create(schoolData) {
    try {
      const { error, value } = this.validate(schoolData);
      if (error) {
        throw new Error(`Validation Error: ${error.details.map(detail => detail.message).join(', ')}`);
      }

      const { name, address, city, state, contact, email_id, image } = value;
      const [existingSchool] = await pool.execute(
        'SELECT id FROM schools WHERE email_id = ?',
        [email_id]
      );

      if (existingSchool.length > 0) {
        throw new Error('A school with this email already exists');
      }

      const [result] = await pool.execute(
        `INSERT INTO schools (name, address, city, state, contact, email_id, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, contact, email_id, image || null]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }
  static async findAll() {
    try {
      const [rows] = await pool.execute("SELECT * FROM schools");
      return rows;
    } catch (error) {
      throw error;
    }
  }
//   try {
//     const { page = 1, limit = 10, search = '', city = '', state = '' } = options;
//     const offset = (page - 1) * limit;

//     let query = 'SELECT * FROM schools';
//     let countQuery = 'SELECT COUNT(*) as total FROM schools WHERE 1=1';
    
//     const queryParams = [];
//     const countParams = [];

//     if (search) {
//       query += ' AND (name LIKE ? OR address LIKE ? OR city LIKE ?)';
//       countQuery += ' AND (name LIKE ? OR address LIKE ? OR city LIKE ?)';
//       const searchTerm = `%${search}%`;
//       queryParams.push(searchTerm, searchTerm, searchTerm);
//       countParams.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (city) {
//       query += ' AND city LIKE ?';
//       countQuery += ' AND city LIKE ?';
//       queryParams.push(`%${city}%`);
//       countParams.push(`%${city}%`);
//     }

//     if (state) {
//       query += ' AND state LIKE ?';
//       countQuery += ' AND state LIKE ?';
//       queryParams.push(`%${state}%`);
//       countParams.push(`%${state}%`);
//     }
    

// query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
// queryParams.push(safeLimit, safeOffset);

//     // query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
//     // queryParams.push(parseInt(limit), parseInt(offset));

//     // Run queries
//     const [schools] = await pool.execute(query, queryParams);
//     const [countResult] = await pool.execute(countQuery, countParams);

//     return {
//       schools,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(countResult[0].total / limit),
//         totalSchools: countResult[0].total,
//         hasNextPage: page < Math.ceil(countResult[0].total / limit),
//         hasPrevPage: page > 1
//       }
//     };
//   } catch (error) {
//     throw error;
//   }
// }


  // Find school by ID
  static async findById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid school ID');
      }

      const [schools] = await pool.execute(
        'SELECT * FROM schools WHERE id = ?',
        [id]
      );

      if (schools.length === 0) {
        return null;
      }

      return schools[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id, updateData) {
    try {
      const { error, value } = this.validate(updateData);
      if (error) {
        throw new Error(`Validation Error: ${error.details.map(detail => detail.message).join(', ')}`);
      }

      const { name, address, city, state, contact, email_id, image } = value;
      const existingSchool = await this.findById(id);
      if (!existingSchool) {
        throw new Error('School not found');
      }
      if (email_id !== existingSchool.email_id) {
        const [emailCheck] = await pool.execute(
          'SELECT id FROM schools WHERE email_id = ? AND id != ?',
          [email_id, id]
        );

        if (emailCheck.length > 0) {
          throw new Error('A school with this email already exists');
        }
      }

      
      await pool.execute(
        `UPDATE schools 
         SET name = ?, address = ?, city = ?, state = ?, contact = ?, email_id = ?, image = ?
         WHERE id = ?`,
        [name, address, city, state, contact, email_id, image || existingSchool.image, id]
      );

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      const existingSchool = await this.findById(id);
      if (!existingSchool) {
        throw new Error('School not found');
      }

      const [result] = await pool.execute(
        'DELETE FROM schools WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByCity(city) {
    try {
      const [schools] = await pool.execute(
        'SELECT * FROM schools WHERE city = ? ORDER BY name ASC',
        [city]
      );
      return schools;
    } catch (error) {
      throw error;
    }
  }


  static async findByState(state) {
    try {
      const [schools] = await pool.execute(
        'SELECT * FROM schools WHERE state = ? ORDER BY name ASC',
        [state]
      );
      return schools;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = School;