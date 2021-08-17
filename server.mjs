import * as fs from "fs/promises";
import { Server } from "net";

const PORT = 3000;
const server = new Server(socket =>{
    let allData = "";
    socket.on("data", data => {
        allData += data;
        const lines = allData.split("\r\n");
        if(lines.findIndex(l =>l === "") >= 0){
            console.log(allData);
            let response = "HTTP/1.1 200 OK\r\n";
            response += "Content-Type: text/html\r\n";
            response += "\r\n";
            response += "<html><body><h1>LOBOS</h1></body></html>\r\n";
            response += "\r\n";
            socket.write(response, () =>{
                socket.end();
            })
        }
    })

});

server.listen(PORT);
console.log(`Server started on port: ${PORT}`);
