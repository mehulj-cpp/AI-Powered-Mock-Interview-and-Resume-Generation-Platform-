import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import * as interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController);


/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController);



export default interviewRouter;