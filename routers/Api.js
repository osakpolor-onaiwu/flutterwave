const router = require("express").Router();
const myDetail = require("../models/myDetail");

router.get("/", (req, res) => {
    myDetail
        .find()
        .select("-_id -__v")
        .then((user) =>
            res.status(200).json({
                message: "My Rule-Validation API",
                status: "success",
                data: user[0],
            })
        )
        .catch((err) => {
            res.status(404).json({
                message: err,
                status: "error",
                data: null,
            });
        });
});

router.post("/validate-rule", (req, res) => {
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

    let dataField;
    let dataFieldValue;

    //runs when the data is an object
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        //gets the field property in the rule object and checks if value exist in the data object
        const isExisting = data.hasOwnProperty(rule.field);

        if (isExisting === false) {
            return res.status(400).json({
                message: `field ${rule.field} is missing from data.`,
                status: "error",
                data: null,
            });
        }

        // filter out field property supplied in the rule from the data object and
        // returns it as an object
        var filteredData = Object.keys(data)
            .filter((key) => rule.field.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        //gets the value of the property from the filtered data
        dataField = Object.getOwnPropertyDescriptor(
            filteredData,
            `${rule.field}`
        );

        dataFieldValue = dataField.value;
    }

    //runs when the data is an Array
    if (typeof data === "object" && data !== null && Array.isArray(data)) {
        //checks if the index of the value in the field property of the rule object, exists in the array
        const isExisting = data[rule.field];

        //runs if the index does not exist
        if (typeof isExisting === "undefined") {
            return res.status(400).json({
                message: `field ${rule.field} is missing from data.`,
                status: "error",
                data: null,
            });
        }

        //if the index exists
        dataFieldValue = isExisting;
    }

    //runs when the data is a string
    if (typeof data === "string") {
        //converts the string to array
        const dataArray = data.split("");

        //checks if the index of the value in the field property of the rule object, exists in the array
        const isExisting = dataArray[rule.field];

        //runs if the index does not exist
        if (typeof isExisting === "undefined") {
            return res.status(400).json({
                message: `field ${rule.field} is missing from data.`,
                status: "error",
                data: null,
            });
        }
        //if the index exists
        dataFieldValue = isExisting;
    }

    //message for validation success
    const validationSuccess = {
        message: `field ${rule.field} successfully validated.`,
        status: "success",
        data: {
            validation: {
                error: false,
                field: `${rule.field}`,
                field_value: dataFieldValue,
                condition: `${rule.condition}`,
                condition_value: rule.condition_value,
            },
        },
    };

    //message for validation error
    const validationError = {
        message: `field ${rule.field} failed validation.`,
        status: "error",
        data: {
            validation: {
                error: true,
                field: `${rule.field}`,
                field_value: dataFieldValue,
                condition: `${rule.condition}`,
                condition_value: rule.condition_value,
            },
        },
    };

    switch (rule.condition) {
        case "eq":
            //checks if the data field value is equal to the condition value
            if (dataFieldValue === rule.condition_value) {
                return res.status(200).json(validationSuccess);
            } else {
                return res.status(400).json(validationError);
            }
            break;

        case "neq":
            //checks if the data field value  is not equal to the condition value
            if (dataFieldValue !== rule.condition_value) {
                return res.status(200).json(validationSuccess);
            } else {
                return res.status(400).json(validationError);
            }
            break;

        case "gt":
            //checks if the data field value  is greater than the condition value
            if (
                typeof dataFieldValue == typeof rule.condition_value &&
                dataFieldValue > rule.condition_value
            ) {
                return res.status(200).json(validationSuccess);
            } else {
                return res.status(400).json(validationError);
            }
            break;

        case "gte":
            //checks if the data field value  is greater than or equal to the condition value
            if (
                typeof dataFieldValue == typeof rule.condition_value &&
                dataFieldValue >= rule.condition_value
            ) {
                return res.status(200).json(validationSuccess);
            } else {
                return res.status(400).json(validationError);
            }
            break;

        case "contains":
            //checks if the data field value is contained in the condition value
            if ((dataFieldValue + "").includes(rule.condition_value)) {
                return res.status(200).json(validationSuccess);
            } else {
                return res.status(400).json(validationError);
            }
            break;

        default:
            break;
    }
});

module.exports = router;
