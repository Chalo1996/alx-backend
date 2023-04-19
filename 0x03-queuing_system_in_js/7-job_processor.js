import kue from 'kue';

const queue = kue.createQueue();

const blackListed = {
    '4153518780': true,
    '4153518781': true
};

function sendNotifcation(phoneNumber, message, job, done) {
    job.progress(0, 100);
    if (blackListed[phoneNumber]) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
}

queue.process('push_notification_code', 2, (job, done) => {
    sendNotifcation(job.data.phoneNumber, job.data.message, job, done);
});
