// npm install path --save -> Not required
// npm install express  --save
// npm install body-parser  --save
// npm install pg --save
// npm install cors --save

// const path = require('path'); -> Not required
const express = require('express');
//const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const {Client} = require('pg');

const pgDbCon = new Client({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "sportshunt"
});

pgDbCon.connect()
.then( () => {console.log("PostgreSQL database connected successfully!")} )
.catch( exception => console.log("PostgreSQL DB Connection Exception: " + exception) );

/* METHOD 1 */
/*
pgDbCon.connect()
.then( () => {console.log("PostgreSQL database connected successfully!")} )
.then( () => pgDbCon.query("SELECT * FROM users") )
.then( results => console.table(results.rows))
.catch( exception => console.log("PostgreSQL DB Connection Exception: " + exception) )
.finally( () => pgDbCon.end() );
*/
/* METHOD 1 ends */

/* METHOD 2 */
/*
execute();

async function execute()
{
    try
    {
        await pgDbCon.connect();
        console.log("PostgreSQL database connected successfully!");
        const results = await pgDbCon.query("SELECT * FROM users");
        console.table(results.rows);
    }
    catch(exception)
    {
        console.log("PostgreSQL DB Connection Exception: " + exception);
    }
    finally
    {
        await pgDbCon.end();
        console.log("PostgreSQL database disconnected");
    }
}
*/
/* METHOD 2 ends */

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/*
router.all('*', function(request, response, next){
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
*/

/*
    http://localhost:8000/
*/
app.get('/', (request, response) => {
    //response.send("HomePage: Nodejs, Express, PostgreSQL App is running");
    response.json({error:false, message: "HomePage: Nodejs, Express, PostgreSQL App is running."});
});

app.listen(8000, () => {
    console.log("App is Listening on port 8000");
});

/*
    http://localhost:8000/getUsers
*/
app.get('/getUsers', async (request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    try
    {
        const results = await pgDbCon.query("SELECT * FROM users");

        queryResponseArray = results.rows;
        jsonObjectOutput['error'] = false;
        jsonObjectOutput['message'] = "All Users";
        jsonObjectOutput['response'] = queryResponseArray;
    }
    catch(exception)
    {
        console.log("Exception occurred while running '/getUsers' API: " + exception);
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "All Users";
        jsonObjectOutput['response'] = exception;
    }
    finally
    {
        response.json(jsonObjectOutput);
    }
});


/*
    http://localhost:8000/login

    {
	    "userId": "awadhvekar@gmail.com",
	    "userPassword": "SportsHunt@1234"
    }
*/
app.post('/login', async (request, response) => {
    //let data = {userId: request.body.userId, userPassword: request.body.userPassword};
    let queryResponseArray = [];
    let jsonObjectOutput = {};

    if(!request.body.userId || !request.body.userPassword)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Login Failed.";
        jsonObjectOutput['response'] = "userId or userPassword missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        const results = await pgDbCon.query("SELECT * FROM users WHERE email_id = $1 AND account_password = $2",
        [request.body.userId, request.body.userPassword]);

        if(results.rowCount != 1)
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Login Failed.";
            jsonObjectOutput['response'] = "userId and userPassword does not match";
        }
        else
        {
            queryResponseArray = results.rows;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Login Successful.";
            jsonObjectOutput['response'] = queryResponseArray;
        }
    }
    catch(exception)
    {
        console.log("Exception occurred while running '/Login' API: " + exception);
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Exception occurred";
        jsonObjectOutput['response'] = exception;
    }
    finally
    {
        response.json(jsonObjectOutput);
    }
});

/*
    http://localhost:8000/register

    {
        "firstName":"firstName2",
        "lastName":"lastName2",
        "emailId":"emailId2",
        "accountPassword":"accountPassword2"
    }
*/
app.post('/register', async (request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};

    if(!request.body.firstName || !request.body.lastName || !request.body.emailId || !request.body.accountPassword)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Registration Failed.";
        jsonObjectOutput['response'] = "firstName or lastName or emailId or accountPassword missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        const results = await pgDbCon.query("INSERT INTO users (first_name, last_name, email_id, account_password) VALUES ($1, $2, $3, $4)",
        [request.body.firstName, request.body.lastName, request.body.emailId, request.body.accountPassword]);
        
        if(results.rowCount == 1 && results.command.toUpperCase() == 'INSERT')
        {
            queryResponseArray = results.rows;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Data Insertrd.";
            jsonObjectOutput['response'] = queryResponseArray;
        }
        else
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Data Insertion Failed.";
            jsonObjectOutput['response'] = "userId and userPassword does not match";

        }
        
    }
    catch(exception)
    {
        console.log("Exception occurred while running '/register' API: " + exception);
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Exception occurred";
        jsonObjectOutput['response'] = exception;
    }
    finally
    {
        response.json(jsonObjectOutput);
    }
});