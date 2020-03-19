# express-http-monitoring

Simple Express/nodeJS app to illustrate my [medium article](https://medium.com/@mhilaire/custom-aws-cloudwatch-metrics-c04d490b51b1)

You can start the app with: `node index.js`

Open a web browser and go to http://localhost:3000 or run `for ((i=1;i<=100;i++)); do   curl -v "localhost:3000"; done` to open connections.

Then observe logs:

```
Server listening on port 3000!
Current opened connections count: 0
Current opened connections count: 1
```
