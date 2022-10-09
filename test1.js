const Nightmare = require('nightmare');
const fs = require('fs');
const request = require('request');
const scrollToBottom = require('scroll-to-bottomjs');
// khởi tạo nightmare
const nightmare = new Nightmare({
    show: true,
    
    webPreferences: {
      // images: false,
      javascript: false,
      nodeIntegration : false
     
  },
    
	switches: {
        
    'ignore-certificate-errors': true
  }
});

nightmare
.goto('https://zingnews.vn/video-highlights-thanh-hoa-2-0-slna-post1351969.html')
  .wait(500) 
    // .evaluate(scrollToBottom)
      .wait(3000)
      .evaluate(function () {
        let obj = {};
                
                //lấy tất cả thông tin bài viết
                let title = document.querySelector('h1.video-title a').getAttribute('title');
                        let tit = title.replace(/'/g, "\\'")
                        obj['title'] =tit;
                        let summary = document.querySelector('p.video-summary').textContent.replace(/'/g, "\\'");
                        obj['summary'] = summary;

                        // let html = document.body.innerHTML;
                        // obj['body'] = html;
                        
        //                 let arrVideo = [];
        //                 let video = document.getElementsByTagName('video')[0];
        //                 let source = video.getElementsByTagName('source')[1];
        //                 // urlImage.forEach((img) => {
        //                 //     arrImage.push(img.src);
        //                 //     // Object.assign(objImage, arrImage);
        //                 //   })              
        //                 obj['urlVideo'] = source;
        // /**************************************** */

        //                 // let objImage ={};
        //                 let arrImage = [];
        //                 let urlImage = document.getElementsByTagName('video')[0].getAttribute('src');
        //                 // urlImage.forEach((img) => {
        //                 //     arrImage.push(img.src);
        //                 //     // Object.assign(objImage, arrImage);
        //                 //   })              
        //                 obj['urlImage'] = urlImage;
          /********************************************* */
          
                return obj;
      })
      .end()
      .then(function (obj) { // titles trong then() này chính là kết quả titles đc trả về ở trên
        
        console.log(obj);
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })
  