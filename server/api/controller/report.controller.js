import Report from "../model/report.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new report
export const createReport = async (req, res, next) => {
    try {
        const { listingId, reason, description } = req.body;
        
        if (!listingId || !reason || !description) {
            return next(errorHandler(400, 'Missing required fields'));
        }

        // Verify listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
                        
        // Check if user already reported this listing
        const existingReport = await Report.findOne({
            listingId,
            reportedBy: req.user.id
        });

        if (existingReport) {
            return next(errorHandler(400, 'You have already reported this listing'));
        }

        // Get user details
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const report = new Report({
            listingId,
            reportedBy: req.user.id,
            reportedByName: user.username,
            reason,
            description,
        });

        await report.save();
        res.status(201).json({
            message: 'Report submitted successfully',
            report
        });
    } catch (error) {
        next(error);
    }
};

// Get reports by user
export const getUserReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ reportedBy: req.user.id })
            .populate('listingId', 'name address')
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};
