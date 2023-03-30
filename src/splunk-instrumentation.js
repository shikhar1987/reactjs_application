import SplunkOtelWeb from '@splunk/otel-web';
SplunkOtelWeb.init({
    beaconUrl: process.env.REACT_APP_beaconUrl,
    rumAuth: process.env.REACT_APP_rumAuth,
    app: "stock_app",
    environment: "johnw_env",
    globalAttributes: {
        'clientId': "123123123123"
    }
});
