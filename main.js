// Gọi module Nightmare để sử dụng
const Nightmare = require('nightmare');
const scrollToBottom = require('scroll-to-bottomjs');
const async = require('async');
const conn = require('./connect.js');
const getAudio = require ('./audio.js');
const schedule = require('node-schedule');

const crawler = () => {
 // thêm option lúc khởi tạo nightmare
const nightmare = Nightmare({
  gotoTimeout: 20000,
  show: true, // hiển thị web khi chạy, nếu không có option này thì chạy ẩn
  switches: {
        
    'ignore-certificate-errors': true
  }
})
// sau khi khởi tạo -> truy xuất vào trang vnexpress.net
nightmare.goto('https://zingnews.vn/bat-dong-san.html')
// .wait(2000)
.evaluate(scrollToBottom)
.wait(2000)
.evaluate(function () {
    // news là 1 mảng chứa các thẻ <a> nằm trong <div> có class 'title_news'
    let newsTable = document.querySelector('.page-wrapper .section')
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
    crawl(titlesarr, function(err, res){
        if(err) {
            console.log('gdfg', err.message)
        }
        console.log('Hoàn thành crawl');
        // console.log('Số lượng bài viết: ', titlesarr.length);
    });
    
    
  })
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR55: ', error);
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
                          .querySelector('h1.the-article-title')
                          .textContent;
                        let tit = title.replace(/'/g, "\\'")
                        obj['title'] =tit;
                        let summary = document.querySelector('p.the-article-summary').textContent.replace(/'/g, "\\'");
                        obj['summary'] = summary;

                        let arrContent = [];
                        // let objContent = {};
                        let content = document.querySelectorAll('.the-article-body > p');
                        // let con = content.replace(/'/g,'cc')
                        content.forEach((cont) => {
                            arrContent.push(cont.textContent.replace(/'/g,"\\'"));
                            // objContent = Object.assign({}, arrContent);
                          })              
                        obj['content'] = arrContent;
                        
                        //get Caption
                        let arrCaption = [];
                        // let objContent = {};
                        let caption = document.querySelectorAll('td.pCaption > p');
                        caption.forEach((caption) => {
                          arrCaption.push(caption.textContent.replace(/'/g,"\\'"));
                            // objContent = Object.assign({}, arrContent);
                          })              
                        obj['caption'] = arrCaption;
        /**************************************** */

                        // let objImage ={};
                        let arrImage = [];
                        let urlImage = document.querySelector('td.pic img').src;
                        // urlImage.forEach((img) => {
                        //     arrImage.push(img.src);
                        //     // Object.assign(objImage, arrImage);
                        //   })              
                        obj['urlImage'] = urlImage;
          /********************************************* */
          
                        return obj;
                }catch (err) {
                  console.log('sdsdf', err.message);
                  return {};
                }
              })
              .end()
              .then(result => {
                // console.log(result)
                // cb(null, result);
                if (!result) {
                  cb(null, {});
                }
                
                try {
                  //get au
                    let id = Math.floor(100000 + Math.random() * 900000)
                    getAudio(result.title+result.summary, id)
                  // update csdl
                  let sql = "INSERT IGNORE INTO articlesdetails (id_category, id_page, title, summary, url_image, content, caption, url_audio) VALUES ('5', '3', '"+result.title+"', '"+result.summary+"', '"+result.urlImage+"', '"+result.content+"', '"+result.caption+"', '"+id+"')";
                  // let sql = "INSERT IGNORE INTO articlesdetails (id_category, id_page, title, summary, url_image, content, caption) VALUES (3, 1,'"+result.title+"', '"+result.summary+"', '"+result.urlImage+"', '"+result.content+"', '"+result.caption+"')";
                  conn
                    .query(sql, function (err, result) {
                        if (err) {
                          throw err;
                        }
                          console.log("thêm thành công!!");// thêm vào CSDL thành công;
                      });
                      

                    cb(null, result); 

                  
                } catch (err) {
                  console.log(err.message);
                  cb(null, {});
                }
          })
          .catch(error => { // xử lý trong trường hợp gặp lỗi 
            console.log('ERROR: ', error);
          })
    }
    async.mapLimit(arr, 1, crawlEachUrl, function (err, res) {
      cb(null, res);
    });

  }
}
crawler();
module.exports = crawler

