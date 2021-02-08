const fs = require("fs");
fs.rename("./lib/", "./node_modules/lib", () => console.log("Local Env Set"));
