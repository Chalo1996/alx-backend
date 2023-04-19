import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('error', (err) => {
    console.log('Redis client not connected to the server:', err.message);
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

const publish = promisify( client.publish ).bind( client );
function publishMessage( message, time ) {
    setTimeout( () => {
        console.log( `About to send ${ message }` );
        publish( 'holberton school channel', message );
    }, time );
}

publishMessage( "Holberton Student #1 starts course", 100 );
publishMessage( "Holberton Student #2 starts course", 200 );
publishMessage( "KILL_SERVER", 300 );
publishMessage( "Holberton Student #3 starts course", 400 );
