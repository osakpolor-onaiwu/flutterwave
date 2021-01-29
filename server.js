const express = require("express");
const mongoose = require("mongoose");

const Api = require("./routers/routes");

app = express();
app.use(express.json());

app.use("/", Api);

//handles errors, when invalid Json in passed
app.use((req, res, next) => {
    const error = new Error();
    next(error);
});

app.use((error, req, res, next) => {
    res.status(400).json({
        message: "Invalid JSON payload passed",
        status: "error",
        data: null,
    });
});

//connects to mongodb atlas remote database
const db =
    "mongodb+srv://osakpolor:daniel1995@cluster0.6awrn.mongodb.net/flutterwave?retryWrites=true&w=majority";

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("db connected to mongodb");

        const port = process.env.PORT || 5000;

        app.listen(port, () => {
            console.log(`Server started on port${port}`);
        });
    })
    .catch((err) => console.log(err));
