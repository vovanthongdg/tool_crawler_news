const Nightmare = require('nightmare');
const fs = require('fs');
const request = require('request');
const scrollToBottom = require('scroll-to-bottomjs');
// khởi tạo nightmare
const nightmare = new Nightmare({
    show: true,
    
  //   webPreferences: {
  //     // images: false,
  //     javascript: false,
  //     nodeIntegration : false
     
  // },
    
	switches: {
        
    'ignore-certificate-errors': true
  }
});

nightmare.goto('https://zingnews.vn/bat-dong-san.html')
// .wait(2000)
.evaluate(scrollToBottom)
.wait(2000)
.evaluate(function () {
    // news là 1 mảng chứa các thẻ <a> nằm trong <div> có class 'title_news'
    let news = document.querySelectorAll('.section-content .article-list p.article-title a');
    // khai báo 1 mảng rỗng để chứa các tiêu đề
    let titlesarr = [];
    let before = 'https://zingnews.vn'
    // chạy qua mảng này và lấy tiêu đề
    news.forEach(article => { // article ở đây là mỗi phần tử trong mảng news
      if(article.getAttribute('href').startsWith('/')){
        titlesarr.push(
          before+article.getAttribute('href')        
        )
      }else {
        titlesarr.push(
          article.getAttribute('href')        
        )
        }; 
    })
    return titlesarr.reverse(); // kết thúc hàm trả về mảng titles
  })

.end() // kết thúc quy trình trên electron -> đóng electron
  .then(titlesarr => { // titles trong then() này chính là kết quả titles đc trả về ở trên
    
        
        console.log('Hoàn thành crawl');
        console.log('Số lượng bài viết: ', titlesarr.length);
    
    
    
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR55: ', error);
  })

// nightmare
// .goto('https://zingnews.vn/novaland-noi-gi-ve-752-can-o-aqua-city-khong-du-dieu-kien-mo-ban-post1375639.html')
//   .wait(500) 
//     // .evaluate(scrollToBottom)
//       .wait(3000)
//       .evaluate(function () {
//         let obj = {};
                
//                 //lấy tất cả thông tin bài viết
//                 let title = document.querySelector('h1.video-title a').getAttribute('title');
//                         let tit = title.replace(/'/g, "\\'")
//                         obj['title'] =tit;
//                         let summary = document.querySelector('p.video-summary').textContent.replace(/'/g, "\\'");
//                         obj['summary'] = summary;

//                         // let html = document.body.innerHTML;
//                         // obj['body'] = html;
                        
//         //                 let arrVideo = [];
//         //                 let video = document.getElementsByTagName('video')[0];
//         //                 let source = video.getElementsByTagName('source')[1];
//         //                 // urlImage.forEach((img) => {
//         //                 //     arrImage.push(img.src);
//         //                 //     // Object.assign(objImage, arrImage);
//         //                 //   })              
//         //                 obj['urlVideo'] = source;
//         // /**************************************** */

//         //                 // let objImage ={};
//         //                 let arrImage = [];
//         //                 let urlImage = document.getElementsByTagName('video')[0].getAttribute('src');
//         //                 // urlImage.forEach((img) => {
//         //                 //     arrImage.push(img.src);
//         //                 //     // Object.assign(objImage, arrImage);
//         //                 //   })              
//         //                 obj['urlImage'] = urlImage;
//           /********************************************* */
          
//                 return obj;
//       })
//       .end()
//       .then(function (obj) { // titles trong then() này chính là kết quả titles đc trả về ở trên
        
//         console.log(obj);
//   })
//   .catch(error => { // xử lý trong trường hợp gặp lỗi 
//     console.log('ERROR: ', error);
//   })
  