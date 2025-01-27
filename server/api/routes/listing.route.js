import express from 'express'
import { verifyToken } from '../utils/verifyToken.js';
import { createListing, deleteListing, updateListing, getListing, getListings, detectFraudForListing, getFraudDetectionHealth } from '../controller/listing.controller.js';

const router = express.Router();

// router.post('/create',verifyToken,createListing);
router.post('/create' ,verifyToken, createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/get/:id',getListing);
router.get('/get',getListings);

// Fraud detection endpoints
router.post('/detect-fraud/:id', verifyToken, detectFraudForListing);
router.get('/fraud-detection/health', getFraudDetectionHealth);

export default  router;
