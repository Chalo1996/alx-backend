import redis from 'redis';

const client = redis.createClient();

client.on( 'error', ( err ) => {
    console.log( 'Redis client not connected to the server:', err.message );
} );

client.on( 'connect', () => {
    console.log( 'Redis client connected to the server' );
    client.subscribe('holberton school channel');
} );

client.on( 'message', ( channel, message ) => {
    console.log( 'Message received: ', message );
    if ( message === 'KILL_SERVER' ) {
        client.unsubscribe( channel );
        client.quit();
    }
} );
