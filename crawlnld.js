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
nightmare.goto('https://nld.com.vn/giao-duc-khoa-hoc.htm')

.wait(1000)
.click('.view-more-stream')
.wait(1000)
.click('.view-more-stream')
.wait(1000)
.click('.view-more-stream')
.wait(1000)

.evaluate(function () {
    // news là 1 mảng chứa các thẻ <a> nằm trong <div> có class 'title_news'
    let newsTable = document.querySelector('.cate-left')
    let news = newsTable.querySelectorAll('.news-item h3 a');
    // khai báo 1 mảng rỗng để chứa các tiêu đề
    let newsArr = [];
    let before = 'https://nld.com.vn'
    // chạy qua mảng này và lấy tiêu đề
    news.forEach(article => { // article ở đây là mỗi phần tử trong mảng news
        newsArr.push(
            urlAr = before+article.getAttribute('href'),

        ); 
    })
    let urlImage = newsTable.querySelectorAll('.news-item a img');
    let urlImageArr = [];
    urlImage.forEach(urlIma => { // article ở đây là mỗi phần tử trong mảng news
        urlImageArr.push({
            urlImage : urlIma.src
        }); 
    })

    // newsArr.push(
    //     urlImageArr

    // )
    return [newsArr, urlImageArr]; // kết thúc hàm trả về mảng titles
  })

.end() // kết thúc quy trình trên electron -> đóng electron
  .then(rs => { // titles trong then() này chính là kết quả titles đc trả về ở trên
    crawl(rs[0], function(err, res){
        if(err) {
            console.log(err.message)
        }
        console.log('Hoàn thành crawl');
        // console.log('Số lượng bài viết: ', titlesarr.length);
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
                        
                        //lấy tất cả thông tin bài viết
                        let title = document
                          .querySelector('h1.title-content')
                          .innerText;
                        let tit = title.replace(/'/g, "\\'")
                        obj['title'] =tit;
                        let summary = document.querySelector('h2.sapo-detail').innerText;
                        obj['summary'] = summary;

                        let arrContent = [];
                        // let objContent = {};
                        let content = document.querySelectorAll('.content-news-detail > p');
                        // let con = content.replace(/'/g,'cc')
                        content.forEach((cont) => {
                            arrContent.push(cont.textContent.replace(/'/g,"\\'"));
                            // objContent = Object.assign({}, arrContent);
                          })              
                        obj['content'] = arrContent;
                        
                        //get Caption
                        let arrCaption = [];
                        // let objContent = {};
                        let caption = document.querySelectorAll('.PhotoCMS_Caption > p');
                        caption.forEach((caption) => {
                          arrCaption.push(caption.textContent);
                            // objContent = Object.assign({}, arrContent);
                          })              
                        obj['caption'] = arrCaption;
        /**************************************** */

                        // let objImage ={};
                        let arrImage = [];
                        let urlImage = document.querySelectorAll('.VCSortableInPreviewMode[type="Photo"] img');
                        urlImage.forEach((img) => {
                            arrImage.push(img.src);
                            // Object.assign(objImage, arrImage);
                          })              
                        obj['urlImage'] = arrImage;
          /********************************************* */
          
                        return obj;
                }catch (err) {
                  console.log(err.message);
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
                  //update csdl
                  let sql = "INSERT IGNORE INTO articlesdetails (id_category, id_page, title, summary, url_image, content, caption) VALUES ('14', '4', '"+result.title+"', '"+result.summary+"', '"+result.urlImage+"', '"+result.content+"', '"+result.caption+"')";
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
    async.mapLimit(arr, 5, crawlEachUrl, function (err, res) {
      cb(null, res);
    });

  }
