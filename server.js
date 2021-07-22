const dotenv = require('dotenv');
const router = require("./routes");
dotenv.config({ path: './config.env' });
const app = require('./app');
router(app);
app.listen(process.env.PORT, () => console.log(`Server running on https://localhost:${process.env.PORT}`))
