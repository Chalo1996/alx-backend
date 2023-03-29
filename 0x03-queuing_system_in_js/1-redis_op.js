import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server: ',
    err.message);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

function setNewSchool (schoolName, value) {
  client.set(schoolName, value, client.print);
}

function displaySchoolValue (schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Value: ${reply}`);
    }
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue( 'HolbertonSanFrancisco' );
setNewSchool('Chala', 'Chala Secondary');
displaySchoolValue('Chala');
