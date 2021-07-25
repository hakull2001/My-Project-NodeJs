const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => console.log(`Redis connected !`));

client.on("error", (error) => console.log(error));

module.exports = client;