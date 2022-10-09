// Gọi module Nightmare để sử dụng
const Nightmare = require('nightmare');
const scrollToBottom = require('scroll-to-bottomjs');
const async = require('async');
const conn = require('./connect.js');
 // thêm option lúc khởi tạo nightmare
const nightmare = Nightmare({
  gotoTimeout: 10000,
  show: true // hiển thị web khi chạy, nếu không có option này thì chạy ẩn
})
// sau khi khởi tạo -> truy xuất vào trang vnexpress.net
nightmare.goto('https://zingnews.vn/video')
// .wait(2000)
.evaluate(scrollToBottom)
.wait(2000)
.evaluate(function () {
    // news là 1 mảng chứa các thẻ <a> nằm trong <div> có class 'title_news'
    let videoTable = document.querySelector('#video-channels')
    let video = videoTable.querySelectorAll('.article-list article.type-video');
    // khai báo 1 mảng rỗng để chứa các tiêu đề
    let titlesarr = [];
    let before = 'https://zingnews.vn'
    // chạy qua mảng này và lấy tiêu đề
    video.forEach(article => { // article ở đây là mỗi phần tử trong mảng news
        linkvideo = article.querySelector('p.article-thumbnail a').href;
        imgvideo = article.querySelector('p.article-thumbnail img').src;

      if(linkvideo.startsWith('/')){
        titlesarr.push(      
            before+linkvideo,
            // img = imgvideo,
          
        )
      }else {
        titlesarr.push(
            linkvideo,
            // img = imgvideo,     
        )
        }; 
    })
    return titlesarr.reverse(); // kết thúc hàm trả về mảng titles
  })

.end() // kết thúc quy trình trên electron -> đóng electron
  .then(titlesarr => { // titles trong then() này chính là kết quả titles đc trả về ở trên
    crawl(titlesarr, function(err, res){
        if(err) {
            console.log(err.message)
        }
        console.log('Hoàn thành crawl');
        // console.log(titlesarr);
    });
    
    
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })

  /**
 * Hàm cào dữ liệu chính nhận 1 mảng các url và tạo nightmare đọc dữ liệu của từng link
 * @param {array} arr - mảng chứa tất cả các url của bài viết
 * @param {function} cb - hàm callback khi hoàn thành 1 tiến trình nightmare tải ảnh
 */

   function crawl(arr, cb) {
  
    function crawlEachUrl(item, cb) {
      // item is each url
      let nightmare = new Nightmare();
      nightmare
        .goto(item)
          .wait(500) 
            .evaluate(scrollToBottom)
              .wait(3000)
              .evaluate(function () {
                try{
                      let obj = {};
                      
                        // obj['link_article'] =item;
                        //lấy tất cả thông tin bài viết
                        let title = document
                          .querySelector('h1.video-title a')
                          .getAttribute(title);
                        let tit = title.replace(/'/g, "\\'")
                        obj['title'] =tit;
                        let summary = document.querySelector('p.video-summary').textContent.replace(/'/g, "\\'");
                        obj['summary'] = summary;
                        
                        let arrVideo = [];
                        let urlVideo = document.querySelector('.video-player video source[1]').src;
                        // urlImage.forEach((img) => {
                        //     arrImage.push(img.src);
                        //     // Object.assign(objImage, arrImage);
                        //   })              
                        obj['urlVideo'] = urlVideo;
        /**************************************** */

                        // let objImage ={};
                        let arrImage = [];
                        let urlImage = document.querySelector('.video-player video').getAttribute('poster');
                        // urlImage.forEach((img) => {
                        //     arrImage.push(img.src);
                        //     // Object.assign(objImage, arrImage);
                        //   })              
                        obj['urlImage'] = urlImage;
          /********************************************* */
          
                        return obj;
                }catch (err) {
                  console.log(err.message);
                  return {};
                }
              })
              .end()
              .then(result => {
                console.log(result)
                cb(null, result);
                // if (!result) {
                //   cb(null, {});
                // }
                
                // try {
                //   //update csdl
                //   let sql = "INSERT IGNORE INTO articlesdetails (id_category, id_page, title, summary, url_image, content, caption) VALUES ('10', '3', '"+result.title+"', '"+result.summary+"', '"+result.urlImage+"', '"+result.content+"', '"+result.caption+"')";
                //   conn
                //     .query(sql, function (err, result) {
                //         if (err) {
                //           throw err;
                //         }
                //           console.log("thêm thành công!!");// thêm vào CSDL thành công;
                //       });
                //     cb(null, result); 
                  
                // } catch (err) {
                //   console.log(err.message);
                //   cb(null, {});
                // }
          })
          .catch(error => { // xử lý trong trường hợp gặp lỗi 
            console.log('ERROR: ', error);
          })
    }
    async.mapLimit(arr, 1, crawlEachUrl, function (err, res) {
      cb(null, res);
    });

  }
