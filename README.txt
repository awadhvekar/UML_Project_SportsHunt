Angular Frontend code:

    npm i ngx-progressbar
    npm install ngx-alerts --save
    npm install ngx-bootstrap --save
    npm install @auth0/angular-jwt

    ng add @angular/material:
        CREATE src/custom-theme.scss (1261 bytes)
        UPDATE src/app/app.module.ts (956 bytes)
        UPDATE angular.json (3646 bytes)
        UPDATE src/index.html (1524 bytes)
        UPDATE src/styles.css (342 bytes)

Node Backend code:
    npm install express  --save
    npm install body-parser  --save
    npm install pg --save
    npm install cors --save
    npm install jsonwebtoken --save
    npm install dotenv --save

    to create random Secret key to be used in jwt: require ('crypto').randomBytes(64).toString('hex')

Elasticsearch:
    GET /sportshunt_elastic_search/_search
    {
        "query": 
        {
            "bool": 
            {
                "must": 
                {
                    "match": 
                    {
                        "ticketmaster_event_id": "ticketMasterEventId1"
                    }
                }
            }
        }
    }

    PUT sportshunt_elastic_search/sports_events_review/1
    {
        "ticketmaster_event_id" : "ticketMasterEventId1",
        "user_id" : 1,
        "user_name" : "Ashutosh Wadhvekar",
        "event_ratings" : "1.5",
        "review_comment" : "Not good Game!!"
    }