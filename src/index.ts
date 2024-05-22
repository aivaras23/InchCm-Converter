import http from 'http';
import fs from 'fs';

const server = http.createServer((req,res)=> {

    const method = req.method;
    const url = req.url;
    
    if(url == '/'){
        res.setHeader('Content-Type','text/html; charset=utf-8');

        const calcTemplate = fs.readFileSync('templates/calc.html');
        res.write(calcTemplate);
        return res.end();

    }

    if(url == '/calculation' && method == 'POST'){
        const storeReqBody:any[]=[];

        req.on('data', (d)=> {
            console.log('gaunami duomenys');
            storeReqBody.push(d);
        })
        req.on('end',()=>{
            console.log('baigti siusti duomenys');
            
            const reqData = Buffer.concat(storeReqBody).toString();
            const splitD = reqData.split('&');
            console.log(splitD);
            const selectedValue = splitD[0].split('=')[1];
            console.log(selectedValue);
            const numberValue = parseFloat(splitD[1].split('=')[1]);
            console.log(numberValue);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');

            let resultTemplate = fs.readFileSync('templates/result.html').toString();
            if(selectedValue === 'inch'){
                 resultTemplate = resultTemplate.toString().replace(/{{ initialType }}/g,'Centimetru');
                 resultTemplate = resultTemplate.toString().replace('{{ initial }}',`${numberValue}`);
                 resultTemplate = resultTemplate.toString().replace('{{ result }}', `${numberValue * 2.54}`);
                 resultTemplate = resultTemplate.toString().replace('{{ type }}', 'Coliai ');
            }
            if(selectedValue === 'cm'){
                 resultTemplate = resultTemplate.toString().replace(/{{ initialType }}/g,'Coliu');
                 resultTemplate = resultTemplate.toString().replace('{{ initial }}',`${numberValue}`);
                 resultTemplate = resultTemplate.toString().replace('{{ result }}', `${Number(numberValue / 2.54).toFixed(4)}`);
                 resultTemplate = resultTemplate.toString().replace('{{ type }}', 'Centimetrai');
            }

            res.write(resultTemplate);

            res.end();
        })
        return;
    }

    res.writeHead(404,{
        'Content-Type':'text/html; charset=utf-8'
    })
    const errorTemplate = fs.readFileSync('templates/404.html');
    res.write(errorTemplate);
    res.end();
})

server.listen(2998,'localhost');