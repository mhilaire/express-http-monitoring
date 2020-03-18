const express = require('express');
const schedule = require('node-schedule');
const aws = require('aws-sdk');

const cloudwatch = new aws.CloudWatch({
    region: 'eu-central-1',
    sslEnabled: true,
    // accessKeyId:'<KEY_OPTIONAL_WITH_ASSUMEROLE>',
    // secretAccessKey: '<SECRET_OPTIONAL_WITH_ASSUMEROLE>'
});


const app = express();
const http = require('http');



const server = http.createServer(app);
// Push count every seconds
schedule.scheduleJob('* * * * * *', () => {
    return server.getConnections((error, count) => {
        if (error) {
            console.error('Error while trying to get server connections', error);
            return;
        }
        
        console.log(`Current opened connections count: ${count}`);
        
        const params = {
            MetricData: [
                {
                    MetricName: 'HTTPConnections',
                    Dimensions: [
                        {
                            Name: 'PerNodeId',
                            Value: '<yourNodeAppID>' 
                            // Get here any dynamic and unique ID than can identify
                            // easily your running node app, like its container ID
                            // (This is tricky from ECS though)
                        },
                    ],
                    Unit: 'Count',
                    Value: count
                },
            ],
            Namespace: 'App/NodeJS'
        };
        //Make sure to set the IAM policy to allow pushing metrics
        cloudwatch.putMetricData(params, (err) => {
            if (err) {
                console.error('Error while trying to push http connections metrics', err);
            }
        });
        
    });
});


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
app.get('/', 
	(req, res) => { 
		// Slow down response speed to let the connection open for at least 1s
		sleep(1500).then(() => {
  		res.send('Hello World!');
		});
	
});

// Throttle max connections opened
// server.maxConnections = 2;

const port = 3000;
server.listen(port, () => console.log(`Server listening on port ${port}!`));

