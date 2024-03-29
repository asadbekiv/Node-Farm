'use strict'
const fs = require('fs');
const http = require('http');
const url = require('url');
const repl =require('node:repl');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplates');


////////////////////////// FILE //////////////////////////////
// Blocking Synchronous way 

// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This what we know about Avacado 🥑 : ${textIn} \n.Created on ${Date.now()}`;

// fs.writeFileSync(`./txt/output.txt`,textOut);

// console.log('File was written');


// Non-blocking Asynchronous way

// fs.readFile(`./txt/start.txt` , 'utf-8' , (err,data1) =>{
    //     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
        //         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
    //             console.log(data3);
    //             fs.writeFile(`./txt/final.txt`,`${data2} \n ${data3}`,'utf-8',err =>{
        //                 if(err) return err
        //                 console.log('All the files have been wrritten in final.txt FILE !5');
        //             })
        
        //         })
        
        //     })
        
        // })
        // console.log('The code readed this start.txt !');
        
        
        ////////////////////////// SERVER //////////////////////////////


        
        
        // C:\Users\iasad\Desktop\1-node-farm\starter\templates\template-product.html
        // C:\Users\iasad\Desktop\1-node-farm\starter\templates\template-overview.html


        // const replaceTemplate = (temp,product) =>{
        //     let output =temp.replace(/{%PRODUCTNAME%}/g,product.productName);
        //     output = output.replace(/{%IMAGE%}/g,product.image);
        //     output = output.replace(/{%PRICE%}/g,product.price);
        //     output = output.replace(/{%FROM%}/g,product.from);
        //     output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);;
        //     output = output.replace(/{%QUANTITY%}/g,product.quantity);
        //     output = output.replace(/{%DESCRIPTION%}/g,product.description);
        //     output = output.replace(/{%ID%}/g,product.id);

        //     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
        //     return output;
        // }


        
        const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8') ;
        const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
        const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
        

        const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8') 
        const dataObj = JSON.parse(data);
        // console.log(tempOverview);
        // console.log(dataObj);
        const slugs = dataObj.map(el => slugify(el.productName,{lower:true}))
        // console.log(slugs);
            

        const server = http.createServer((req,res) =>{

            
            const {query,pathname} = url.parse(req.url,true);
            // console.log(pathname);
            // console.log(query);
            // console.log(query.id);
            
            
            // OVERVIEW PAGE
            if(pathname === '/' || pathname === '/overview' ){
                
                // res.writeHead(200,{'content-type':'text/html'});
                
                const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
                const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
                
                
                res.end(output);
 
                // PRODUCT PAGE
            }else if(pathname === '/product'){
                res.writeHead(200,{'Content-type':'text/html'});
                const product = dataObj[query.id];
                const output = replaceTemplate(tempProduct,product);
                // console.log(product);
                res.end(output)

                // API
            }else if(pathname === '/api'){

                res.writeHead(200,{'Content-type':'application/json'});
                res.end(data);
          
                // NOT FOUND
            }else{
                res.writeHead(404,{
                    'content-type':'text/html',
                    'my-own-content': 'hello-world'
                });
                res.end('<h1>Page not found</h1> <br> <hr>')
            }
        });

        server.listen(6000,'127.0.0.1',()=>{
            console.log('Server is running on port 6000 :');
        })




        
        
        
 