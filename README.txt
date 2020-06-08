Angular Frontend code:

    npm i ngx-progressbar
    npm install ngx-alerts --save
    npm install ngx-bootstrap --save
    npm install @auth0/angular-jwt
    npm install @types/googlemaps

    npm install jquery --save
    npm install datatables.net --save
    npm install datatables.net-dt --save
    npm install angular-datatables --save
    npm install @types/jquery --save-dev
    npm install @types/datatables.net --save-dev
    npm install datatables.net-responsive --save
    npm install datatables.net-responsive-dt --save

    npm install @agm/core

    ng add @ng-bootstrap/ng-bootstrap

    npm install chart.js --save

    ng generate component auth/components/eventdetail

Node Backend code:
    npm install express  --save
    npm install body-parser  --save
    npm install pg --save
    npm install cors --save
    npm install jsonwebtoken --save
    npm install dotenv --save
    npm install nodemailer --save

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