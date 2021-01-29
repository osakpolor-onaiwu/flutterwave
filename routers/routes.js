const router = require("express").Router();
const getController = require("../controllers/get");
const checkController = require("../controllers/checks");

router.get("/", getController.myDetail);

router.post("/validate-rule", checkController.AllChecks);

module.exports = router;
