const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

function replaceTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%EMOJI%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
}

const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true)
  // API
  if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // OVERVIEW
  } else if (pathname ==="/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHTML = dataObject.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)
    console.log(output)
    res.end(output);

    // PRODUCT
  } else if (pathname === "/product") {
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // 404
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>where even are you now??</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests!!");
});

// synchronous, blocking
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn)
// const textOut = "some text"
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("Success!")

//async, non-blocking
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => { //always takes 2 args when reading
//     if(err) return console.log("there was a problem!", err) //handle your errors

//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2} \n ${data3}`,
//         "utf-8",
//         (err) => { //onely takes one arg when writing
//           console.log("i'm done writing");
//         }
//       );
//     });
//   });
//   console.log(data);
//   console.log(err); //no error so it's null
// });
// console.log("I come first");
