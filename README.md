# flutterwave
run npm install to install all dependencies
run npm run server to run the server locally

#This app is for validating certain data by comparing them with certain conditions
The base route accepts a get request and fetches my details from the a remote database. Optionally this data could have been hardcoded
but i think getting it from a database is more proper

The second route i.e /validate-rule, accept only a post request. and compares the data with certain condition stated in a rule object
e.g a payload like this
{
    "rule":{
        "field":"age",
        "condition":"neq",
        "condition_value":5
    },
    "data":{
        "name":"john",
        "crew":"luffy",
        "age":5,
        "position":"admiral",
        "missions":5
    }
}

will evaluate to
{
    "message": "field age failed validation.",
    "status": "error",
    "data": {
        "validation": {
            "error": true,
            "field": "age",
            "field_value": 5,
            "condition": "neq",
            "condition_value": 5
        }
    }
}
because the value of age is actually equal to the condition value
