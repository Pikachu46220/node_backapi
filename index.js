const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'test',
});

db.connect();

app.use(bodyParser.json());
//เรียกทั้งหมด
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // อนุญาตให้ทุกๆ โดเมนเข้าถึง (* หมายถึงทุกๆ โดเมน)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/api/data', (req, res) => {
  db.query(`SELECT 
            id ,
            firstname AS ชื่อ,
            tel AS เบอร์โทรศัพท์,
            gender AS เพศ,
            selectedshop AS สินค้าหรือบริการ,
            selectedpromotion AS โปรโมชั่น,
            selectedplace AS สาขาที่สะดวกใช้บริการ,
            text AS ข้อเสนอเพิ่มเติม,
            createdata AS วันที่บันทึก 
            FROM basic`, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});

app.post('/api/sumdata', (req, res) => {
  console.log(req.body);
  let sql = `
      SELECT selectedplace AS สาขา,
      SUM(CASE WHEN selectedshop LIKE '%ยางรถยนต์%' THEN 1 ELSE 0 END) AS ยางรถยนต์,
      SUM(CASE WHEN selectedshop LIKE '%ผ้าเบรก%' THEN 1 ELSE 0 END) AS ผ้าเบรก,
      SUM(CASE WHEN selectedshop LIKE '%สลับยาง-ถ่วงล้อ%' THEN 1 ELSE 0 END) AS สลับยางถ่วงล้อ,
      SUM(CASE WHEN selectedshop LIKE '%แม็กซ์%' THEN 1 ELSE 0 END) AS แม็กซ์,
      SUM(CASE WHEN selectedshop LIKE '%โช้ค%' THEN 1 ELSE 0 END) AS โช้ค,
      SUM(CASE WHEN selectedshop LIKE '%ตรวจเช็คสภาพรถ%' THEN 1 ELSE 0 END) AS ตรวจเช็คสภาพรถ,
      SUM(CASE WHEN selectedshop LIKE '%น้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS น้ำมันเครื่อง,
      SUM(CASE WHEN selectedshop LIKE '%ตั้งศูนย์%' THEN 1 ELSE 0 END) AS ตั้งศูนย์,
      SUM(CASE WHEN selectedshop LIKE '%ช่วงล่าง%' THEN 1 ELSE 0 END) AS ช่วงล่าง,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นยางรถยนต์%' THEN 1 ELSE 0 END) AS โปรโมชั่นยางรถยนต์,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นน้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS โปรโมชั่นน้ำมันเครื่อง,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นช่วงล่าง%' THEN 1 ELSE 0 END) AS โปรโมชั่นช่วงล่าง,
      SUM(CASE WHEN gender = 'ชาย' THEN 1 ELSE 0 END) AS ชาย,
      SUM(CASE WHEN gender = 'หญิง' THEN 1 ELSE 0 END) AS หญิง
FROM basic
WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
GROUP BY selectedplace
UNION ALL
SELECT
  	'รวม' AS selectedplace,
 	SUM(CASE WHEN selectedshop LIKE '%ยางรถยนต์%' THEN 1 ELSE 0 END) AS ยางรถยนต์,
  	SUM(CASE WHEN selectedshop LIKE '%ผ้าเบรก%' THEN 1 ELSE 0 END) AS ผ้าเบรก,
  	SUM(CASE WHEN selectedshop LIKE '%สลับยาง%' THEN 1 ELSE 0 END) AS สลับยาง,
  	SUM(CASE WHEN selectedshop LIKE '%แม็กซ์%' THEN 1 ELSE 0 END) AS แม็กซ์,
  	SUM(CASE WHEN selectedshop LIKE '%โช้ค%' THEN 1 ELSE 0 END) AS โช้ค,
  	SUM(CASE WHEN selectedshop LIKE '%ตรวจเช็คสภาพรถ%' THEN 1 ELSE 0 END) AS ตรวจเช็คสภาพรถ,
  	SUM(CASE WHEN selectedshop LIKE '%น้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS น้ำมันเครื่อง,
  	SUM(CASE WHEN selectedshop LIKE '%ตั้งศูนย์%' THEN 1 ELSE 0 END) AS ตั้งศูนย์,
  	SUM(CASE WHEN selectedshop LIKE '%ช่วงล่าง%' THEN 1 ELSE 0 END) AS ช่วงล่าง,
    SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นยางรถยนต์%' THEN 1 ELSE 0 END) AS โปรโมชั่นยางรถยนต์,
    SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นน้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS โปรโมชั่นน้ำมันเครื่อง,
    SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นช่วงล่าง%' THEN 1 ELSE 0 END) AS โปรโมชั่นช่วงล่าง,
    SUM(CASE WHEN gender = 'ชาย' THEN 1 ELSE 0 END) AS ชาย,
    SUM(CASE WHEN gender = 'หญิง' THEN 1 ELSE 0 END) AS หญิง
FROM
  basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
`;
  db.query(sql, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});

//สรุปตามเพศ
app.post('/api/sumhgenter', (req, res) => {
  console.log(req.body);
  let sql = `
  SELECT  A.เพศ, B.จำนวน,ยางรถยนต์,  ผ้าเบรก,สลับยางถ่วงล้อ,แม็กซ์,โช้ค,ตรวจเช็คสภาพรถ,น้ำมันเครื่อง,ตั้งศูนย์,ช่วงล่าง,โปรโมชั่นยางรถยนต์,โปรโมชั่นน้ำมันเครื่อง,โปรโมชั่นช่วงล่าง
  FROM (  SELECT
        gender AS เพศ,
        SUM(CASE WHEN selectedshop LIKE '%ยางรถยนต์%' THEN 1 ELSE 0 END) AS ยางรถยนต์,
        SUM(CASE WHEN selectedshop LIKE '%ผ้าเบรก%' THEN 1 ELSE 0 END) AS ผ้าเบรก,
        SUM(CASE WHEN selectedshop LIKE '%สลับยาง-ถ่วงล้อ%' THEN 1 ELSE 0 END) AS สลับยางถ่วงล้อ,
        SUM(CASE WHEN selectedshop LIKE '%แม็กซ์%' THEN 1 ELSE 0 END) AS แม็กซ์,
        SUM(CASE WHEN selectedshop LIKE '%โช้ค%' THEN 1 ELSE 0 END) AS โช้ค,
        SUM(CASE WHEN selectedshop LIKE '%ตรวจเช็คสภาพรถ%' THEN 1 ELSE 0 END) AS ตรวจเช็คสภาพรถ,
        SUM(CASE WHEN selectedshop LIKE '%น้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS น้ำมันเครื่อง,
        SUM(CASE WHEN selectedshop LIKE '%ตั้งศูนย์%' THEN 1 ELSE 0 END) AS ตั้งศูนย์,
        SUM(CASE WHEN selectedshop LIKE '%ช่วงล่าง%' THEN 1 ELSE 0 END) AS ช่วงล่าง,
        SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นยางรถยนต์%' THEN 1 ELSE 0 END) AS โปรโมชั่นยางรถยนต์,
        SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นน้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS โปรโมชั่นน้ำมันเครื่อง,
        SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นช่วงล่าง%' THEN 1 ELSE 0 END) AS โปรโมชั่นช่วงล่าง
  FROM basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
  GROUP BY gender

  UNION ALL

  SELECT
      'รวม' as gender,
     SUM(CASE WHEN selectedshop LIKE '%ยางรถยนต์%' THEN 1 ELSE 0 END) AS ยางรถยนต์,
      SUM(CASE WHEN selectedshop LIKE '%ผ้าเบรก%' THEN 1 ELSE 0 END) AS ผ้าเบรก,
      SUM(CASE WHEN selectedshop LIKE '%สลับยาง%' THEN 1 ELSE 0 END) AS สลับยาง,
      SUM(CASE WHEN selectedshop LIKE '%แม็กซ์%' THEN 1 ELSE 0 END) AS แม็กซ์,
      SUM(CASE WHEN selectedshop LIKE '%โช้ค%' THEN 1 ELSE 0 END) AS โช้ค,
      SUM(CASE WHEN selectedshop LIKE '%ตรวจเช็คสภาพรถ%' THEN 1 ELSE 0 END) AS ตรวจเช็คสภาพรถ,
      SUM(CASE WHEN selectedshop LIKE '%น้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS น้ำมันเครื่อง,
      SUM(CASE WHEN selectedshop LIKE '%ตั้งศูนย์%' THEN 1 ELSE 0 END) AS ตั้งศูนย์,
      SUM(CASE WHEN selectedshop LIKE '%ช่วงล่าง%' THEN 1 ELSE 0 END) AS ช่วงล่าง,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นยางรถยนต์%' THEN 1 ELSE 0 END) AS โปรโมชั่นยางรถยนต์,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นน้ำมันเครื่อง%' THEN 1 ELSE 0 END) AS โปรโมชั่นน้ำมันเครื่อง,
      SUM(CASE WHEN selectedpromotion LIKE '%โปรโมชั่นช่วงล่าง%' THEN 1 ELSE 0 END) AS โปรโมชั่นช่วงล่าง
  FROM
    basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
  ) AS A

  LEFT JOIN ( 
  SELECT 'ชาย' AS เพศ, SUM(CASE WHEN gender = 'ชาย' THEN 1 ELSE 0 END) AS จำนวน
  FROM basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
             
  UNION ALL
  
  SELECT 'หญิง' AS เพศ, SUM(CASE WHEN gender = 'หญิง' THEN 1 ELSE 0 END) AS จำนวน
  FROM basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
             
  UNION ALL
  SELECT 'รวม' AS เพศ, COUNT(gender) AS จำนวน
  FROM basic
  WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'          
  ) AS B
  
  ON A.เพศ=B.เพศ
`;
  db.query(sql, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});
//สรุปตามสาขา
app.post('/api/branch', (req, res) => {
  db.query(
    `SELECT  
    SUM(CASE WHEN branchscan = 'bypass' THEN 1 ELSE 0 END) AS สาขาบายพาสภูเก็ต,
    SUM(CASE WHEN branchscan = 'chaofa' THEN 1 ELSE 0 END) AS สาขาเจ้าฟ้าตะวันออก,
    SUM(CASE WHEN branchscan = 'khokkloi' THEN 1 ELSE 0 END) AS สาขาโคกกลอย,
    SUM(CASE WHEN branchscan = 'phangnga' THEN 1 ELSE 0 END) AS สาขาเมืองพังงา,
    SUM(CASE WHEN branchscan = 'thaiwatsadu' THEN 1 ELSE 0 END) AS สาขาไทวัสดุท่าเรือ,
    SUM(CASE WHEN branchscan = 'thalang' THEN 1 ELSE 0 END) AS สาขาถลางทางเข้าสนามบิน
    FROM basic
    WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59'
    `
    , (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});
//ค้นหา
app.post('/api/search', (req, res) => {
  console.log("ค่าที่ส่งมา :",req.body);
  
  let serchBranch ='';
  let serchShop ='';
  let serchPromotion ='';
  let gender ='';

  if(req.body.branch != ''){
    serchBranch = ` AND selectedplace = '${req.body.branch}'`;
  }

  if(req.body.shop != ''){
    serchShop = ` AND selectedshop LIKE '%${req.body.shop}%'`;
  }

  if(req.body.promotion != ''){
    serchPromotion = ` AND selectedpromotion LIKE '%${req.body.promotion}%'` ;
  }

  if(req.body.gender != ''){
    gender = ` AND gender = '${req.body.gender}'` ;
  }

  let sql = `SELECT  
                    id ,
                    firstname AS ชื่อ,
                    tel AS เบอร์โทรศัพท์,
                    gender AS เพศ,
                    selectedshop AS สินค้าหรือบริการ,
                    selectedpromotion AS โปรโมชั่น,
                    selectedplace AS สาขาที่สะดวกใช้บริการ,
                    text AS ข้อเสนอเพิ่มเติม,
                    createdata AS วันที่บันทึก
            FROM basic WHERE createdata BETWEEN '${req.body.startDate} 00:00:00' AND '${req.body.endDate} 23:59:59' ${serchBranch}${serchShop}${serchPromotion}${gender}`;
  console.log(sql);

  db.query(sql, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});
//เก็บข้อมูลแบบฟอร์ม
app.post('/api/insertdata',(req, res) => {
  console.log("req.body : " + req.body);
  let convertShop =  req.body.selectedShop.join(',');
  let convertPromotion =  req.body.selectedPromotion.join(',');
  
  let data = {
    "firstname"       : req.body.firstName,
    "tel"             : req.body.tel,
    "gender"          : req.body.gender,
    "selectedshop"    : convertShop,
    "selectedpromotion": convertPromotion,
    "selectedplace"   : req.body.selectedPlace,
    "text"            : req.body.text,
    "status"          : req.body.status,
    "branchscan"      : req.body.branchscan,
  }
  db.query(
    'INSERT INTO basic SET ? ', data, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json("ok"); //res.json(results);
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
