// npm install path --save -> Not required
// npm install express  --save
// npm install body-parser  --save
// npm install pg --save
// npm install cors --save
// npm install jsonwebtoken --save
// npm install dotenv --save
// npm install elasticsearch --save
// no requre to run, used to create random Secret key to be used in jwt: require ('crypto').randomBytes(64).toString('hex')

// const path = require('path'); -> Not required
const express = require('express');
//const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const cors = require('cors');
const elasticsearch = require('elasticsearch');
const {Client} = require('pg');

const esClient = new elasticsearch.Client({
    host: "localhost:9200",
    log: 'error'
});

esClient.ping({
        requestTimeout: 1000
    },
    function (error) {
        if (error) {
            console.log("Elasticsearch cluster is down! Error: " + error);
        }
        else {
            console.log("Elasticsearch is up and running");
        }
    }
);

const insertedDoc = async function(ticketMasterEventId, userId, userName, eventRating, reviewComment) {
    return await esClient.index({
        index: "sportshunt_elastic_search",
        type: "sports_events_review",
        body: {
            ticketmaster_event_id: ticketMasterEventId,
            user_id: userId,
            user_name: userName,
            event_ratings: eventRating,
            review_comment: reviewComment
        }
    });
}

const searchDoc = async function(searchBody){
    return await esClient.search({
        index: "sportshunt_elastic_search",
        type: "sports_events_review",
        body: searchBody
    });
}

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

/*
    http://localhost:8000/addOrder

    {
        "ticketMasterEventId":"firstName2",
        "eventName":"lastName2",
        "eventCity":"emailId2",
        "eventDate":"accountPassword2",
        "eventSportsName":"accountPassword2"
    }
*/
app.post('/addOrder', authenticateJwtToken, async(request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    let stausCode;
    let userId;

    userId = request.userDetails.userId;
    //console.log("User Id: " + request.userDetails.userId);

    if(!request.body.eventName){
        request.body.eventName = null;
    }

    if(!request.body.eventCity){
        request.body.eventCity = null;
    }

    if(!request.body.eventDate){
        request.body.eventDate = null;
    }

    if(!request.body.eventSportsName){
        request.body.eventSportsName = null;
    }

    if(!request.body.ticketMasterEventId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "userId or ticketMasterEventId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        /*
            await pgDbCon.connect();
            await pgDbCon.query("BEGIN");
            await pgDbCon.query("INSERT / UPDATE / DELETE query");
            await pgDbCon.query("COMMIT");
        */
        const results = await pgDbCon.query("INSERT INTO ticket_orders (user_id, event_name, ticketmaster_event_id, order_city, order_date, order_sports_name)"
         + " VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_id",
        [userId, request.body.eventName, request.body.ticketMasterEventId, request.body.eventCity, request.body.eventDate, request.body.eventSportsName]);
        
        if(results.rowCount == 1 && results.command.toUpperCase() == 'INSERT')
        {
            //console.log(results.rows[0].order_id);
            queryResponseArray = results.rows;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Data Insertrd. Last Interted Id/ PK: " + results.rows[0].order_id;
            jsonObjectOutput['response'] = queryResponseArray;
            stausCode = 200;
        }
        else
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Data Insertion Failed.";
            jsonObjectOutput['response'] = "Error: " + results;
            stausCode = 400;

        }
    }
    catch(exception)
    {
        console.log(`Exception occurred while running '/addOrder' API: ${exception}`);
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

/*
    http://localhost:8000/makePayment

    {
        "orderId":"firstName2",
        "numberOfTickets":"lastName2",
        "totalPrice":"emailId2",
        "creditCardNumber":"accountPassword2",
        "address":"accountPassword2"
    }
*/
app.post('/makePayment', authenticateJwtToken, async(request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    let stausCode;
    let userId;

    userId = request.userDetails.userId;
    //console.log("User Id: " + request.userDetails.userId);

    if(!request.body.numberOfTickets){
        request.body.numberOfTickets = 1;
    }

    if(!request.body.orderId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Payment Insertion Failed.";
        jsonObjectOutput['response'] = "orderId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    if(!request.body.totalPrice || !request.body.creditCardNumber || !request.body.address)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Payment Insertion Failed.";
        jsonObjectOutput['response'] = "totalPrice / creditCardNumber / address missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        /*
            await pgDbCon.connect();
            await pgDbCon.query("BEGIN");
            await pgDbCon.query("INSERT / UPDATE / DELETE query");
            await pgDbCon.query("COMMIT");
            await pgDbCon.query("ROLLBACK");
        */

        // await pgDbCon.query("BEGIN");
        const retrievedUserResult = await pgDbCon.query("SELECT user_id from ticket_orders WHERE order_id = $1", [request.body.orderId]);
        
        if(retrievedUserResult.rows[0].user_id == userId)
        {
            const results = await pgDbCon.query("INSERT INTO ticket_payments (user_id, order_id, number_of_tickets, total_price, credit_card_number, address) "
            + "VALUES ($1, $2, $3, $4, $5, $6) RETURNING payment_id",
            [userId, request.body.orderId, request.body.numberOfTickets, request.body.totalPrice, request.body.creditCardNumber, request.body.address]);
            
            if(results.rowCount == 1 && results.command.toUpperCase() == 'INSERT')
            {
                // await pgDbCon.query("COMMIT");
                // console.log(results.rows[0].payment_id);
                queryResponseArray = results.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "Data Insertrd. Last Interted Payment Id/ PK: " + results.rows[0].payment_id;
                jsonObjectOutput['response'] = queryResponseArray;
                stausCode = 200;
            }
            else
            {
                // await pgDbCon.query("ROLLBACK");
                jsonObjectOutput['error'] = true;
                jsonObjectOutput['message'] = "Data Insertion Failed.";
                jsonObjectOutput['response'] = "Error: " + results;
                stausCode = 400;

            }
            
        }
        else
        {
            // await pgDbCon.query("ROLLBACK");
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Data Insertion Failed.";
            jsonObjectOutput['response'] = "Error: orderId does not belong to logged in user";
            stausCode = 400;
        }
    }
    catch(exception)
    {
        console.log(`Exception occurred while running '/makePayment' API: ${exception}`);
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

/*
    http://localhost:8000/confirmTicketMakePayment

    {
        "ticketMasterEventId":"ticketMasterEventId4",
        "eventName":"event Name 4",
        "eventCity":"eventCity 4",
        "eventDate":"2020-05-15T00:10:00Z",
        "eventSportsName":"Cricket"
        //"orderId":"firstName2",
        "numberOfTickets":"lastName2",
        "totalPrice":"emailId2",
        "creditCardNumber":"accountPassword2",
        "address":"accountPassword2"
    }
*/
app.post('/confirmTicketMakePayment', authenticateJwtToken, async(request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    let stausCode;
    let userId;
    let orderId;

    userId = request.userDetails.userId;
    //console.log("User Id: " + request.userDetails.userId);

    if(!request.body.numberOfTickets){
        request.body.numberOfTickets = 1;
    }

    /*
    if(!request.body.orderId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Payment Insertion Failed.";
        jsonObjectOutput['response'] = "orderId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }
    */

    if(!request.body.totalPrice || !request.body.creditCardNumber || !request.body.address)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Payment Insertion Failed.";
        jsonObjectOutput['response'] = "totalPrice / creditCardNumber / address missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    if(!request.body.eventName){
        request.body.eventName = null;
    }

    if(!request.body.eventCity){
        request.body.eventCity = null;
    }

    if(!request.body.eventDate){
        request.body.eventDate = null;
    }

    if(!request.body.eventSportsName){
        request.body.eventSportsName = null;
    }

    if(!request.body.ticketMasterEventId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "userId or ticketMasterEventId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        /*
            await pgDbCon.connect();
            await pgDbCon.query("BEGIN");
            await pgDbCon.query("INSERT / UPDATE / DELETE query");
            await pgDbCon.query("COMMIT");
            await pgDbCon.query("ROLLBACK");
        */

        // const retrievedUserResult = await pgDbCon.query("SELECT user_id from ticket_orders WHERE order_id = $1", [request.body.orderId]);
        
        /*
        if(retrievedUserResult.rows[0].user_id == userId)
        {
        */
            await pgDbCon.query("BEGIN");
            /* addOrder */
            const addOrderResults = await pgDbCon.query("INSERT INTO ticket_orders (user_id, event_name, ticketmaster_event_id, order_city, order_date, order_sports_name)"
            + " VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_id",
            [userId, request.body.eventName, request.body.ticketMasterEventId, request.body.eventCity, request.body.eventDate, request.body.eventSportsName]);
            
            if(addOrderResults.rowCount == 1 && addOrderResults.command.toUpperCase() == 'INSERT')
            {
                //console.log(results.rows[0].order_id);
                queryResponseArray = addOrderResults.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "Data Insertrd. Last Interted Id/ PK: " + addOrderResults.rows[0].order_id;
                jsonObjectOutput['response'] = queryResponseArray;
                stausCode = 200;
                orderId = addOrderResults.rows[0].order_id;
            }
            else
            {
                jsonObjectOutput['error'] = true;
                jsonObjectOutput['message'] = "Data Insertion Failed.";
                jsonObjectOutput['response'] = "Error: " + addOrderResults;
                stausCode = 400;

            }
            /* addOrder */

            /* makePayment */
            const makePaymentResults = await pgDbCon.query("INSERT INTO ticket_payments (user_id, order_id, number_of_tickets, total_price, credit_card_number, address) "
            + "VALUES ($1, $2, $3, $4, $5, $6) RETURNING payment_id",
            [userId, orderId, request.body.numberOfTickets, request.body.totalPrice, request.body.creditCardNumber, request.body.address]);
            
            if(makePaymentResults.rowCount == 1 && makePaymentResults.command.toUpperCase() == 'INSERT')
            {
                // await pgDbCon.query("COMMIT");
                // console.log(results.rows[0].payment_id);
                queryResponseArray = makePaymentResults.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "Data Insertrd. Last Interted Payment Id/ PK: " + makePaymentResults.rows[0].payment_id;
                jsonObjectOutput['response'] = queryResponseArray;
                stausCode = 200;
                await pgDbCon.query("COMMIT");
            }
            else
            {
                await pgDbCon.query("ROLLBACK");
                jsonObjectOutput['error'] = true;
                jsonObjectOutput['message'] = "Data Insertion Failed.";
                jsonObjectOutput['response'] = "Error: " + results;
                stausCode = 400;

            }
            /* makePayment */
        /*    
        }
        else
        {
            // await pgDbCon.query("ROLLBACK");
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Data Insertion Failed.";
            jsonObjectOutput['response'] = "Error: orderId does not belong to logged in user";
            stausCode = 400;
        }
        */
    }
    catch(exception)
    {
        console.log(`Exception occurred while running '/makePayment' API: ${exception}`);
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

/*
    http://localhost:8000/addEventReview

    {
        "ticketMasterEventId":"firstName2",
        "eventRating":"accountPassword2",
        "reviewComment":"accountPassword2"
    }
*/
app.post('/addEventReview', authenticateJwtToken, async(request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    let stausCode;
    let userId;
    let userName;

    userId = request.userDetails.userId;
    userName = request.userDetails.userFirstName + " " + request.userDetails.userLastName;
    //console.log("User Id: " + request.userDetails.userId);

    if(!request.body.ticketMasterEventId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "ticketMasterEventId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    if(!request.body.eventRating)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "eventRating missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    if(!request.body.reviewComment)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "reviewComment missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        const results = await insertedDoc(request.body.ticketMasterEventId, userId, userName, request.body.eventRating, request.body.reviewComment);
        
        if(results._version == 1 && results.result.toUpperCase() == 'CREATED')
        {
            queryResponseArray = results._id;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Review Insertrd. Last Interted Id: " + results._id;
            jsonObjectOutput['response'] = queryResponseArray;
            stausCode = 200;
        }
        else
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Review Insertion Failed.";
            jsonObjectOutput['response'] = "Error: " + results;
            stausCode = 400;

        }
    }
    catch(exception)
    {
        console.log(`Exception occurred while running '/addEventReview' API: ${exception}`);
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

/*
    http://localhost:8000/addEventReview

    {
        "ticketMasterEventId":"firstName2"
    }
*/
app.post('/viewEventReview', authenticateJwtToken, async(request, response) => {
    let queryResponseArray = [];
    let jsonObjectOutput = {};
    let stausCode;
    let userId;
    let userName;

    userId = request.userDetails.userId;

    if(!request.body.ticketMasterEventId)
    {
        jsonObjectOutput['error'] = true;
        jsonObjectOutput['message'] = "Order Insertion Failed.";
        jsonObjectOutput['response'] = "ticketMasterEventId missing";
        response.status(400).json(jsonObjectOutput);
        return;
    }

    try
    {
        let searchFilter = {
                                "query": 
                                {
                                    "bool": 
                                    {
                                        "must": 
                                        {
                                            "match": 
                                            {
                                                "ticketmaster_event_id": request.body.ticketMasterEventId
                                            }
                                        }
                                    }
                                }
                            }

        const results = await searchDoc(searchFilter);
        
        if(results.hits.total.value > 0)
        {
            //console.log(results.rows[0].order_id);
            queryResponseArray = results.hits.hits;
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "Review extracted.";
            jsonObjectOutput['response'] = queryResponseArray;
            stausCode = 200;
        }
        else
        {
            jsonObjectOutput['error'] = false;
            jsonObjectOutput['message'] = "No Reviews present.";
            jsonObjectOutput['response'] = "No Reviews present for this event";
            stausCode = 200;

        }
    }
    catch(exception)
    {
        console.log(`Exception occurred while running '/viewEventReview' API: ${exception}`);
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

/*
    http://localhost:8000/getUserEvents
*/
app.get('/getUserEvents', authenticateJwtToken, async (request, response) => {
    // app.get('/getUsers', async (request, response) => {
        //console.log(request);
        let userId;
        let queryResponseArray = [];
        let jsonObjectOutput = {};

        userId = request.userDetails.userId;

        try
        {
            const results = await pgDbCon.query("SELECT ord.order_id, ord.event_name, ord.ticket_price, ord.ticketmaster_event_id, "
            + "ord.order_sports_name,ord.order_city, pay.payment_id, pay.number_of_tickets, pay.total_price "
            + "FROM ticket_orders ord JOIN ticket_payments pay ON ord.order_id = pay.order_id WHERE ord.user_id = $1", [userId]);
            //console.log(results);
    
            if(results.rowCount > 0)
            {
                queryResponseArray = results.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "All User Events";
                jsonObjectOutput['response'] = queryResponseArray;
            }
            else
            {
                queryResponseArray = results.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "No events.";
                jsonObjectOutput['response'] = queryResponseArray;
            }

        }
        catch(exception)
        {
            console.log("Exception occurred while running '/getUserEvents' API: " + exception);
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "All User Events";
            jsonObjectOutput['response'] = exception;
        }
        finally
        {
            response.json(jsonObjectOutput);
        }
    });


/*
http://localhost:8000/getDivvyDockingStationsInfo

{
    "location_lat":"firstName2",
    "location_lng":"firstName2"
}
*/
    app.post('/getDivvyDockingStationsInfo', authenticateJwtToken, async(request, response) => {
        let queryResponseArray = [];
        let jsonObjectOutput = {};
        let stausCode;
    
        if(!request.body.location_lat || !request.body.location_lng)
        {
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "Order Insertion Failed.";
            jsonObjectOutput['response'] = "location_lat or location_lng missing";
            response.status(400).json(jsonObjectOutput);
            return;
        }
    
        try
        {
            /*
                await pgDbCon.connect();
                await pgDbCon.query("BEGIN");
                await pgDbCon.query("INSERT / UPDATE / DELETE query");
                await pgDbCon.query("COMMIT");
            */
            const results = await pgDbCon.query("SELECT * FROM divvy_stations_realtime_status ORDER BY (divvy_stations_realtime_status.where_is <-> ST_POINT($1, $2)) LIMIT 3",
            [request.body.location_lat, request.body.location_lng]);
            
            if(results.rowCount > 0 && results.command.toUpperCase() == 'SELECT')
            {
                //console.log(results.rows[0].order_id);
                queryResponseArray = results.rows;
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "Stations Listed";
                jsonObjectOutput['response'] = queryResponseArray;
                stausCode = 200;
            }
            else
            {
                jsonObjectOutput['error'] = true;
                jsonObjectOutput['message'] = "No stations available/ listed for given lat and long";
                jsonObjectOutput['response'] = "Error: " + results;
                stausCode = 200;
    
            }
        }
        catch(exception)
        {
            console.log(`Exception occurred while running '/getDivvyDockingStationsInfo' API: ${exception}`);
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

/*
    http://localhost:8000/getRecommendedCityAndSports
*/
app.get('/getRecommendedCityAndSports', authenticateJwtToken, async (request, response) => {
        let userId;
        let queryResponseArray = [];
        let jsonObjectOutput = {};

        userId = request.userDetails.userId;

        try
        {
            const sportsNameResults = await pgDbCon.query("SELECT order_sports_name FROM (SELECT order_sports_name, COUNT(*) as cnt, ROW_NUMBER() OVER (PARTITION BY order_sports_name ORDER BY COUNT(*) DESC) as seqnum FROM ticket_orders WHERE user_id = $1 GROUP BY order_sports_name) ct WHERE seqnum = 1;", [userId]);
            const cityNameResults = await pgDbCon.query("SELECT order_city FROM (SELECT order_city, COUNT(*) as cnt, ROW_NUMBER() OVER (PARTITION BY order_city ORDER BY COUNT(*) DESC) as seqnum FROM ticket_orders WHERE user_id = $1 GROUP BY order_city) ct WHERE seqnum = 1;", [userId]);
    
            if(sportsNameResults.rowCount > 0 && cityNameResults.rowCount > 0)
            {
                recomendedSports = sportsNameResults.rows[0].order_sports_name;
                recomendedCity = cityNameResults.rows[0].order_city;
                queryResponseArray.push({recomendedSports: recomendedSports});
                queryResponseArray.push({recomendedCity: recomendedCity});

                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "City and Sports suggested.";
                jsonObjectOutput['response'] = queryResponseArray;
            }
            else
            {
                queryResponseArray.push({recomendedSports: "No suggestions"});
                queryResponseArray.push({recomendedCity: "No suggestions"});
                jsonObjectOutput['error'] = false;
                jsonObjectOutput['message'] = "No suggestions";
                jsonObjectOutput['response'] = queryResponseArray;
            }

        }
        catch(exception)
        {
            console.log("Exception occurred while running '/getUserEvents' API: " + exception);
            jsonObjectOutput['error'] = true;
            jsonObjectOutput['message'] = "All User Events";
            jsonObjectOutput['response'] = exception;
        }
        finally
        {
            response.json(jsonObjectOutput);
        }
    });