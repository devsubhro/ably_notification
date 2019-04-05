/*****
 * This code returns a web page and that web page receives notification from ably.io channel.
 * The channel name set by this code
 */
const [ bin, sourcePath, ...args ] = process.argv;
const fedback_channel_name = args[0];

const http = require('http');
const fs = require('fs');
const path = require('path');

const config = require('./config.js');
const port = 3000;

const request_handler = (request, response ) => {
    if (request.url != '/') {
        response.statusCode = 404;
        response.statusMessage = 'Not provided';
        response.end();
        return;
    }
    const file_path = path.join(path.resolve(), '/page.html');
    fs.open(file_path, 'r', (open_err, f_handle) => {
        if (open_err) {
            console.log('file open error', open_err);
            response.end('Error');
            return;
        }
        fs.readFile(f_handle, (read_err, file_data) => {
            if (read_err) {
                console.log('read error', read_err);
                response.end('Error');
                fs.close(f_handle, (close_err) => {
                    //do nothing
                    return;
                });
                return;
            }
            let string_file_data = file_data.toString();
            string_file_data = string_file_data.replace('{{api_key}}', config.api_key);
            string_file_data = string_file_data.replace('{{chanel_name}}', fedback_channel_name);
            response.end(string_file_data);
            fs.close(f_handle, (close_err) => {
                //do nothing
                return;
            });
        });
    });
    return;
};

const server = http.createServer(request_handler);
server.listen(port, (err) => {
    if (err) {
        console.log('Oops', err);
        return;
    }
});

console.log(`server is listening on port ${port}`);
