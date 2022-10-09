let fs = request ('fs'); 
let Client = request ('ssh2-sftp-client'); 
let client = new Client ();
let config = { 
    host: 'Replace-with-host.compute.amazonaws.com', 
    port: 22, 
    username: 'ec2-user', 
    privateKey: Request ('fs'). readFileSync ('Replace-with-path- to-pemfile.pem ') 
};
let localFile = '/path/to/your/local/file.js'; 
let remoteFile = '/home/fastnews33.site/public_html/audio';
client.connect (config) .then (() => client.fastPut (localFile, remoteFile)). then (() => { 
    client.end (); 
}). catch (err => { 
    console.error (err .message); 
});