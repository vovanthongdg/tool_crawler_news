const axios = require('axios');
const fs = require('fs');

const getAudio = async (text, id) =>  {

    let path = 'C:/xampp/htdocs/newsapp/audio'

    const url = 'https://viettelgroup.ai/voice/api/tts/v1/rest/syn'
    const data = {"text": text, "voice": "hn-phuongtrang", "id": "2", "without_filter": false, "speed": 1.0, "tts_return_option": 3}


    const config = {
        method: 'post',
        responseType: 'stream',
        headers: { 'Content-Type': 'application/json',
                    'token' : 'p9w1Q-SZ7H5BSAXqNEUG8DQ8WmwnP32PxJUE5oxIU8bxpEZVDdurZTU-LJ0WPelk'
        }
    }
    try {
        let res = await axios.post(url, data, config)
        res.data.pipe(fs.createWriteStream(`${path}/${id}.mp3`))
        
    } catch (error) {
        console.log('Error', error.message);
        
    }
}
getAudio();
module.exports = getAudio;
