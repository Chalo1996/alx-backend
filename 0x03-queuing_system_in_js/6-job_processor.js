import kue from 'kue';

const queue = kue.createQueue();

const sendNotification = ( phoneNumber, message, job, done ) => {
    job.progress( 0, 100 );
    console.log( `Sending notification to ${ phoneNumber }, with message: ${ message }` );
    job.progress( 50, 100 );
    done();
    job.progress( 100, 100 );
};

queue.process( 'push_notification_code', 2, ( job, done ) => {
    const { phoneNumber, message } = job.data;
    sendNotification( phoneNumber, message, job, done );
});
