const credentials = {};

credentials.host = process.env.FB_HOST;
credentials.port = process.env.FB_PORT;
credentials.database = process.env.DB_DATABASE;
credentials.user = process.env.FB_USER;
credentials.password = process.env.FB_PASS;
credentials.localcase_keys = false;
credentials.role = null;
credentials.pageSize = 4096;
credentials.pageSize = 4096;
credentials.retryConnectionInterval = 1000;

module.exports = credentials;