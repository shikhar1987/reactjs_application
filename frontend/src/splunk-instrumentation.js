import SplunkOtelWeb from '@splunk/otel-web';
SplunkOtelWeb.init({
    beaconUrl: "https://rum-ingest.us0.signalfx.com/v1/rum",
    rumAuth: "a5OVE71NXiRkCYxH34_Fbw",
    app: "stock_app",
    environment: "johnw_env"
});
