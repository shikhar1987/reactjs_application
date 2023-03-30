import SplunkOtelWeb from '@splunk/otel-web';
SplunkOtelWeb.init({
    beaconUrl: process.env.beaconUrl,
    rumAuth: process.env.rumAuth,
    app: "stock_app",
    environment: "johnw_env",
    globalAttributes: {
        'clientId': "123123123123"
    }
});
