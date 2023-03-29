import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server: ',
    err.message);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

function setNewSchool (schoolName, value) {
  client.set(schoolName, value, redis.print);
}

async function displaySchoolValue (schoolName) {
  const resAsync = promisify(client.get).bind(client);
  try {
    const value = await resAsync(schoolName);
    console.log(`Value: ${value}`);
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}
(async function () {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
  setNewSchool('Chala', 'Chala Secondary');
  await displaySchoolValue('Chala');
})();
