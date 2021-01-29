//this controller checks the type of the data field and then validates
//based on the rule conditon

const validate = {
    validateRule(req, res) {
        const { rule, data } = req.body;

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

        //handles the validation
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
    },
};

module.exports = validate;
