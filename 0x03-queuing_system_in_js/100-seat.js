const redis = require( "redis" );
const { promisify } = require( "util" );

const client = redis.createClient();

// promisify Redis commands
const getAsync = promisify( client.get ).bind( client );
const setAsync = promisify( client.set ).bind( client );

// reserve a seat
async function reserveSeat ( number ) {
    await setAsync( "available_seats", number );
}

// get current available seats
async function getCurrentAvailableSeats () {
    const seats = await getAsync( "available_seats" );
    return { numberOfAvailableSeats: seats };
}

// initialize available seats and reservationEnabled
async function initialize () {
    await setAsync( "available_seats", 50 );
    reservationEnabled = true;
}

initialize();

// queue
const kue = require( "kue" );

const queue = kue.createQueue( {
    redis: {
        port: 6379,
        host: "127.0.0.1",
    },
} );

//
const express = require( "express" );
const app = express();
const port = 1245;

// get current available seats
app.get( "/available_seats", async ( req, res ) => {
    const seats = await getCurrentAvailableSeats();
    res.json( seats );
} );

// reserve a seat
app.get( "/reserve_seat", async ( req, res ) => {
    if ( !reservationEnabled ) {
        res.json( { status: "Reservation are blocked" } );
        return;
    }

    const job = queue.create( "reserve_seat" ).save( ( err ) => {
        if ( err ) {
            res.json( { status: "Reservation failed" } );
            return;
        }

        res.json( { status: "Reservation in process" } );
    } );

    job.on( "complete", () => {
        console.log( `Seat reservation job ${ job.id } completed` );
    } );

    job.on( "failed", ( err ) => {
        console.log( `Seat reservation job ${ job.id } failed: ${ err }` );
    } );
} );

// process the reserve_seat queue
app.get( "/process", async ( req, res ) => {
    res.json( { status: "Queue processing" } );

    queue.process( "reserve_seat", async ( job, done ) => {
        const seats = await getCurrentAvailableSeats();
        const newSeats = seats - 1;

        if ( newSeats < 0 ) {
            done( new Error( "Not enough seats available" ) );
            return;
        }

        await reserveSeat( newSeats );

        if ( newSeats === 0 ) {
            reservationEnabled = false;
        }

        done();
    } );
} );

app.listen( port, () => {
    console.log( `Server listening at http://localhost:${ port }` );
} );
