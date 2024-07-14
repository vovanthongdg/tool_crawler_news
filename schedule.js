const schedule = require('node-schedule');
const crawler = require('./main.js')
const conn = require('./connect.js')

const zing_bds1 = 'https://zingnews.vn/bat-dong-san.html';
const zing_khoahoc2 = 'https://zingnews.vn/blockchain.html';
const zing_bdvn3 = 'https://zingnews.vn/bong-da-viet-nam.html';
const zing_phapluat5 = 'https://zingnews.vn/phap-luat.html';
const zing_congnghe8 = 'https://zingnews.vn/cong-nghe.html';
const zing_giaitri6 = 'https://zingnews.vn/giai-tri.html';
const zing_thegioi7 = 'https://zingnews.vn/the-gioi.html';
const zing_kinhte10 = 'https://zingnews.vn/kinh-doanh-tai-chinh.html';
const zing_dulich11 = 'https://zingnews.vn/du-lich.html';
const zing_suckhoe13 = 'https://zingnews.vn/suc-khoe.html';
const zing_giaoduc14 = 'https://zingnews.vn/giao-duc.html';

schedule.scheduleJob('*/1 * * * *', function(){
  conn
    console.log('Bat dau crawl data moi nha');
    crawler(zing_bds1, 3, 1);
    crawler(zing_khoahoc2, 3, 2);
    crawler(zing_bdvn3, 3 ,3)
    crawler(zing_phapluat5, 3 ,5)
    crawler(zing_congnghe8, 3, 8)
    crawler(zing_giaitri6, 3, 6)
    crawler(zing_thegioi7, 3, 7)
    crawler(zing_kinhte10, 3, 10)
    crawler(zing_dulich11, 3, 11)
    crawler(zing_suckhoe13, 3, 13)
    crawler(zing_giaoduc14, 3, 14)



  });
  