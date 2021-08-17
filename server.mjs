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
                response += "HTTP/1.1 200 OK\r\n";
                response += "\r\n";
                response += fileContent;
                response += "\r\n";
            } catch (ERROR){
                response += "HTTP/1.1 404 Not Found\r\n";
                response += "Content-Type: text/html\r\n"
                response += "\r\n";
                response += `<html><body><h1>${fileName} not found </h1></body></html>\r\n`;
                response += "\r\n";
            }
            socket.write(response, () =>{
                socket.end();
            });
        }
    })

});

server.listen(PORT);
console.log(`Server started on port: ${PORT}`);
