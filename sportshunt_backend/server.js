// npm install path --save -> Not required
// npm install express  --save
// npm install body-parser  --save
// npm install pg --save
// npm install cors --save
// npm install jsonwebtoken --save
// npm install dotenv --save
// no requre to run, used to create random Secret key to be used in jwt: require ('crypto').randomBytes(64).toString('hex')

// const path = require('path'); -> Not required
const express = require('express');
//const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
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

function authenticateJwtToken(request, response, next){
    if(request.headers.Authorization){
        return response.status(401).send("Unauthorized Request: header does contains Authorization field.");
    }

    // AUTHORIZATION in Header Format: "Bearer TOKEN_VALUE"
    let authHeader = request.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    //let token = request.headers.Authorization.split(' ')[1];
    if(token === 'null'){
        return response.status(401).send("Unauthorized Request: Token is null.");
    }

    let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!payload){
        return response.status(401).send("Unauthorized Request: Invalid JWT token.");
        // send status code 403 if token is invalid
    }
    /*
    console.log(payload);
    {
        userEmail: 'awadhvekar@gmail.com',
        userId: 1,
        userFirstName: 'Ashutosh',
        userLastName: 'Wadhvekar',
        iat: 1586819874
    }
    */

    /*
    console.log(payload.subject);
    undefined
    */
    request.userDetails = payload;
    next();
}

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
app.get('/getUsers', authenticateJwtToken, async (request, response) => {
// app.get('/getUsers', async (request, response) => {
    //console.log(request);
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
    let stausCode;
    let accessToken = null;

    if(!request.body.userId || !request.body.userPassword)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Login Failed.";
        jsonObjectOutput['response'] = "userId or userPassword missing";
        jsonObjectOutput['token'] = accessToken;
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
            jsonObjectOutput['token'] = accessToken;
            stausCode = 400;
        }
        else
        {
            let payload = {};
            payload['userEmail'] = results.rows[0].email_id;
            payload['userId'] = results.rows[0].user_id;
            payload['userFirstName'] = results.rows[0].first_name;
            payload['userLastName'] = results.rows[0].last_name;
            
            accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

            queryResponseArray = results.rows;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Login Successful.";
            jsonObjectOutput['response'] = queryResponseArray;
            jsonObjectOutput['token'] = accessToken;
            stausCode = 200;
        }
    }
    catch(exception)
    {
        console.log("Exception occurred while running '/Login' API: " + exception);
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Exception occurred";
        jsonObjectOutput['response'] = exception;
        jsonObjectOutput['token'] = accessToken;
        stausCode = 400;
    }
    finally
    {
        response.status(stausCode).json(jsonObjectOutput);
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
    let stausCode;

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
            stausCode = 200;
        }
        else
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Data Insertion Failed.";
            jsonObjectOutput['response'] = "userId and userPassword does not match";
            stausCode = 400;

        }
        
    }
    catch(exception)
    {
        console.log("Exception occurred while running '/register' API: " + exception);
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Exception occurred";
        jsonObjectOutput['response'] = exception;
        stausCode = 400;
    }
    finally
    {
        response.status(stausCode).json(jsonObjectOutput);
    }
});