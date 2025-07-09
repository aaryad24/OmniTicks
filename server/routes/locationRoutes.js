

import express from 'express'
import { theaters } from '../controllers/locationController.js';

const router = express.Router();

// locationRoutes.js
router.post('/theaters', theaters);  // Handles POST /api/theaters

export default router;
