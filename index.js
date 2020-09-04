const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;
const cardHtml = fs.readFileSync("templates/template-card.html", 'utf-8');
const overviewHtml = fs.readFileSync("templates/template-overview.html", 'utf-8');
const productHtml = fs.readFileSync("templates/template-product.html", 'utf-8');
const data = fs.readFileSync("data.json", 'utf-8');
const dataObj = JSON.parse(data);

replaceTemplate = (temp, data) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, data.productName);
    output = output.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%ID%}/g, data.id);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, data.description);
    output = output.replace(/{%FROM%}/g, data.from);

    if (!data.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const server = http.createServer((req, res) => {
    let pathway = req.url;
    console.log(pathway);
    //  let pathname = url.parse(req.url, true).pathname
    const { query, pathname } = url.parse(req.url, true);
    if (pathway == '/' || pathway == "/overview") {
        let allCard = dataObj.map(el => replaceTemplate(cardHtml, el)).join(" ")
        //console.log(allCard);
        let newOverviewHtml = overviewHtml.replace(/{%PRODUCT_CARDS%}/g, allCard);
        res.end(newOverviewHtml);
    } else if (pathway === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
        // Not found
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(productHtml, product);
        res.end(output);
        // API
    } else {
        res.writeHead(404, {
            'content': "application/text"
        })
        res.end("<h1 style='color:red;text-align:center;'>Page Not Found</h1>");
    }
})
server.listen(3000, '127.0.0.1', () => {
    console.log("Server is ruunig at" + port);
});
