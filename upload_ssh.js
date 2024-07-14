let fs = require ('fs'); 
let Client = require ('ssh2-sftp-client'); 
let client = new Client ();
let config = { 
    host: 'ec2-3-0-209-240.ap-southeast-1.compute.amazonaws.com', 
    port: 22, 
    username: 'ubuntu', 
    privateKey: Request ('fs'). readFileSync ('C:/Users/vovan/Desktop/keyvps/fastnews.pem ') 
};
let localFile = './1234.wav'; 
let remoteFile = '/home/fastnews33.site/public_html/audio';
client.connect (config) .then (() => client.fastPut (localFile, remoteFile)). then (() => { 
    client.end (); 
}). catch (err => { 
    console.error (err .message); 
});