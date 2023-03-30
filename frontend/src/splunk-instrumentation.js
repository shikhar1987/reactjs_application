import SplunkOtelWeb from '@splunk/otel-web';
SplunkOtelWeb.init({
   beaconUrl: "https://rum-ingest.us1.signalfx.com/v1/rum",
   rumAuth: "lIcnEUBMgRzeVMoePk_0Mg",
   app: "stock_app",
   environment: "johnw_env"
});
