import { expect } from 'chai';
import sinon from 'sinon';
import kue from 'kue';
import createPushNotificationsJobs from './8-job';

describe( 'createPushNotificationsJobs function', () => {
    let queue;

    before( () => {
        // Create a test queue
        queue = kue.createQueue();
    } );

    after( () => {
        // Clean up the test queue
        queue.testMode.clear();
    } );

    it( 'should throw an error if jobs is not an array', () => {
        expect( () => createPushNotificationsJobs( 'not an array', queue ) ).to.throw( 'Jobs is not an array' );
    } );

    it( 'should create a new job for each job in the jobs array', () => {
        const jobs = [ { foo: 'bar' }, { baz: 'qux' } ];
        createPushNotificationsJobs( jobs, queue );

        expect( queue.testMode.jobs.length ).to.equal( 2 );
    } );

    it( 'should log a success message when a job is successfully created', () => {
        const job = { foo: 'bar' };
        const spy = sinon.spy( console, 'log' );

        createPushNotificationsJobs( [ job ], queue );

        expect( spy.calledWithMatch( `Notification job created: ` ) ).to.be.true;

        spy.restore();
    } );

    it( 'should log a success message when a job is completed', () => {
        const job = { foo: 'bar' };
        const spy = sinon.spy( console, 'log' );

        createPushNotificationsJobs( [ job ], queue );

        queue.process( 'push_notification_code_3', () => { } );

        queue.on( 'job complete', ( id ) => {
            expect( spy.calledWithMatch( `Notification job ${ id } completed` ) ).to.be.true;

            spy.restore();
        } );
    } );

    it( 'should log an error message when a job fails', () => {
        const job = { foo: 'bar' };
        const spy = sinon.spy( console, 'log' );

        createPushNotificationsJobs( [ job ], queue );

        queue.process( 'push_notification_code_3', ( job, done ) => {
            done( new Error( 'Job failed' ) );
        } );

        queue.on( 'job failed', ( id, errorMessage ) => {
            expect( spy.calledWithMatch( `Notification job ${ id } failed: ${ errorMessage }` ) ).to.be.true;

            spy.restore();
        } );
    } );

    it( 'should log a progress message when a job makes progress', () => {
        const job = { foo: 'bar' };
        const spy = sinon.spy( console, 'log' );

        createPushNotificationsJobs( [ job ], queue );

        queue.process( 'push_notification_code_3', ( job, ctx, done ) => {
            job.progress( 50 );

            done();
        } );

        queue.on( 'job progress', ( id, progress ) => {
            expect( spy.calledWithMatch( `Notification job ${ id } ${ progress }% complete` ) ).to.be.true;

            spy.restore();
        } );
    } );
} );
