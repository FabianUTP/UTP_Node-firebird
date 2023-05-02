const credentials = {};

if(process.env.MODE === "local") {
  credentials.host = process.env.FB_HOST_LOCAL;
  credentials.database = process.env.FB_DATABASE_LOCAL
}

if(process.env.MODE === "server"){
  credentials.host = process.env.FB_HOST_SERVER;
  credentials.database = process.env.FB_DATABASE_SERVER
}

credentials.port = process.env.FB_PORT;
credentials.user = process.env.FB_USER;
credentials.password = process.env.FB_PASS;
credentials.localcase_keys = false;
credentials.role = null;
credentials.pageSize = 4096;
credentials.pageSize = 4096;
credentials.retryConnectionInterval = 1000;
credentials.blobAsText = false;

module.exports = credentials;
