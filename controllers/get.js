const myDetail = require("../models/myDetail");

const getController = {
    myDetail(req, res) {
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
    },
};

module.exports = getController;
