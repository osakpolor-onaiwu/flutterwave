// this controller handles checking if required fields are supplied
// and if they are of the right types

const checks = {
    TypesAndSupplied(req, res) {
        const { rule, data } = req.body;

        //checks if rule is passed
        if (!rule) {
            return res.status(400).json({
                message: "rule is required.",
                status: "error",
                data: null,
            });
        }

        //checks if rule is an object
        if (typeof rule !== "object") {
            return res.status(400).json({
                message: "rule should be of type object.",
                status: "error",
                data: null,
            });
        }

        //checks if data is supplied
        if (!data) {
            return res.status(400).json({
                message: "data is required.",
                status: "error",
                data: null,
            });
        }

        //checks if the data of the right type
        if (typeof data !== "object" && typeof data !== "string") {
            return res.status(400).json({
                message: "data should be of type object,array or string.",
                status: "error",
                data: null,
            });
        }

        //checks if the rule field is a number and is 0
        if (rule.field === 0) {
            return res.status(400).json({
                message: "field should be a string.",
                status: "error",
                data: null,
            });
        }

        //checks if field is supplied
        if (!rule.field) {
            return res.status(400).json({
                message: "field is required.",
                status: "error",
                data: null,
            });
        }

        //check if condition is supplied
        if (!rule.condition) {
            return res.status(400).json({
                message: "condition  is required.",
                status: "error",
                data: null,
            });
        }

        //checks if condition value is supplied
        if (!rule.condition_value) {
            return res.status(400).json({
                message: "condition_value is required.",
                status: "error",
                data: null,
            });
        }

        // ensure the condition field does not contain other values aside gte,gt,eq,neq,contains
        if (
            rule.condition !== "gte" &&
            rule.condition !== "gt" &&
            rule.condition !== "eq" &&
            rule.condition !== "neq" &&
            rule.condition !== "contains"
        ) {
            res.status(400).json({
                message: `condition only accepts any of the following gte, gt, eq, neq, contains.`,
                status: "error",
                data: null,
            });
        }
    },
};

module.exports = checks;
