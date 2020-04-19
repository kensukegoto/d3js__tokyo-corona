const path = require("path");

const dirScript = new RegExp(path.join(__dirname,"..","script"));
console.log(dirScript)

module.exports = (mode = "development") => {
    
    return {
        mode: mode,
        entry: {
            "js/index": "../script/index.js",
        },
        output:{
            filename: "[name].bundle.js",
        },
        module: {
            rules: [
                { 
                    test: /\.js$/, 
                    loader: "babel-loader",
                    exclude: [
                        /node_modules/
                    ]
                }
            ]
        },
        devtool: (mode === "development") ? "inline-source-map" : false
    }
}