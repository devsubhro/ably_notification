/*****
 * This code returns a web page and that web page receives notification from ably.com channel.
 * The channel name set by this code
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
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
            const string_file_data = file_data.toString();
            const content = string_file_data.replace('{{name}}', 'asdfgthbvcsdr');
            response.end(content);
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
