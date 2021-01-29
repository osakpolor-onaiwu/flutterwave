const router = require("express").Router();
const getController = require("../controllers/get");
const validateController = require("../controllers/validate");
const checkController = require("../controllers/checks");

router.get("/", getController.myDetail);

router.post(
    "/validate-rule",
    validateController.validateRule,
    checkController.TypesAndSupplied
);

module.exports = router;
