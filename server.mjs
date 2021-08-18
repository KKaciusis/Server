import * as fs from "fs/promises";
import * as path from "path";
import { Server } from "net";

const PORT = 3000;
const WEB = "websiteFiles";

const server = new Server(socket =>{
    socket.setEncoding("utf-8");
    let allData = "";
    socket.on("data", async data => {
        allData += data;
        const lines = allData.split("\r\n");
        if(lines.findIndex(l =>l === "") >= 0){
            let fileName = lines[0].split(" ")[1];
            let response = "";
            try {
                let fullFileName = path.join(WEB, fileName);
                const fileContent = await fs.readFile(fullFileName);
                response += createResponce(200, "OK", null, fileContent);
            } catch (ERROR){
                if(error instanceof TypeError){
                    throw error;
                }
                response = createResponce( 404, "Not Found",{"Content-Type": "text/html"} `<html><body><h1>${fileName} not found</h1></body></html>` )
            }
            socket.write(response, () =>{
                socket.end();
            });
        }
    })

});

function createResponce(status, msg, headers, content){
    if (typeof status !== "number"){
        throw new TypeError("status must be a number");
    }
    if (typeof msg !== "string"){
        throw new TypeError("msg must be a string");
    }
    if (headers && typeof headers !== "object"){
        throw new TypeError("headers must be an object");
    }
    if (content && typeof content !== "string"){
        throw new TypeError("headers must be an object");
    }
    let res = `HTTP/1.1 ${status} ${msg}\r\n`
    if (headers) {
        for (const header in headers);{
        res += `${header}: ${headers[header]}\r\n`;                
        }
        res += "\r\n";
        if (content){
            res += content;
        }
        res += "\r\n";
        return res;
    }
}
server.listen(PORT);
console.log(`Server started on port: ${PORT}`);
