const PORT = process.env.PORT || 3000;
const Server = require('./src/server');

const sv = new Server(PORT);
sv.listen(PORT);