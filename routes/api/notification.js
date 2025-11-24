const express = require("express");
const router = express.Router();
const notificationController = require("../../controller/api/notification.js");
const { isLoggedInAPI } = require("../../middleware/middleware.js");

router.get("/", isLoggedInAPI, notificationController.getNotifications);
router.put("/:id/read", isLoggedInAPI, notificationController.markAsRead);

module.exports = router;
