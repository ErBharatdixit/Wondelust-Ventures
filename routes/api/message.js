const express = require("express");
const router = express.Router();
const messageController = require("../../controller/api/message.js");
const { isLoggedInAPI, isVerifiedAPI } = require("../../middleware/middleware.js");

router.post("/", isLoggedInAPI, isVerifiedAPI, messageController.sendMessage);
router.get("/inbox", isLoggedInAPI, messageController.getInbox);
router.get("/conversation/:userId", isLoggedInAPI, messageController.getConversation);

module.exports = router;
