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
        console.log(rs[0])
        
    })
    
    
  .catch(error => { // xử lý trong trường hợp gặp lỗi 
    console.log('ERROR: ', error);
  })