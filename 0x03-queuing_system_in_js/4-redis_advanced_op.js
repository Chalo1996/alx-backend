const redis = require( 'redis' );
const client = redis.createClient();

client.on( 'error', ( err ) => {
    console.log( 'Redis client not connected to the server:', err.message );
} );

client.on( 'connect', () => {
    console.log( 'Redis client connected to the server' );
} );

const setSchoolHash = ( schools ) => {
    for ( const key in schools ) {
        client.hset( 'HolbertonSchools', key, schools[ key ], redis.print );
    }
};

const displayHash = ( key, callback ) => {
    client.hgetall( key, ( err, res ) => {
        if ( err ) {
            callback( err, null );
        } else {
            callback( null, res );
        }
    } );
};

setSchoolHash( {
    'Portland': 50,
    'Seattle': 80,
    'New York': 20,
    'Bogota': 20,
    'Cali': 40,
    'Paris': 2,
} );

displayHash( 'HolbertonSchools', ( err, res ) => {
    if ( err ) {
        console.error( err );
    } else {
        console.log( res );
        client.quit();
    }
} );
