-- Drops if they exist
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table structure for table users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  mobile_no varchar(15) NOT NULL,
  role varchar(30) DEFAULT 'USER' CHECK (role IN ('USER', 'SHOP_ADMIN', 'MAIN_ADMIN')),
  status varchar(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table shops
CREATE TABLE shops (
  shop_id SERIAL PRIMARY KEY,
  shop_name varchar(100) NOT NULL UNIQUE,
  shop_admin_id int NOT NULL REFERENCES users (user_id),
  status varchar(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED'))
);

-- Table structure for table menu
CREATE TABLE menu (
  menu_id SERIAL PRIMARY KEY,
  shop_id int NOT NULL REFERENCES shops (shop_id),
  item_name varchar(100) NOT NULL,
  price decimal(8,2) NOT NULL,
  category varchar(50) DEFAULT NULL,
  availability_status varchar(30) DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'UNAVAILABLE'))
);

-- Table structure for table orders
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id int NOT NULL REFERENCES users (user_id),
  shop_id int NOT NULL REFERENCES shops (shop_id),
  token_number int NOT NULL,
  status varchar(30) DEFAULT 'PAYMENT_PENDING' CHECK (status IN ('PAYMENT_PENDING', 'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')),
  order_time timestamp DEFAULT CURRENT_TIMESTAMP,
  order_date date DEFAULT CURRENT_DATE,
  CONSTRAINT shop_id_date_token_unique UNIQUE (shop_id, order_date, token_number)
);

-- Table structure for table order_items
CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id int NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
  menu_id int NOT NULL REFERENCES menu (menu_id),
  quantity int NOT NULL CHECK (quantity > 0),
  price_at_order decimal(8,2) NOT NULL
);

-- Table structure for table password_resets
CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id int NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  otp_code varchar(6) NOT NULL,
  expiry_time timestamp NOT NULL,
  is_used boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table payments
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  order_id int NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
  amount decimal(8,2) NOT NULL,
  payment_method varchar(50) DEFAULT NULL,
  payment_gateway varchar(50) DEFAULT NULL,
  transaction_id varchar(100) DEFAULT NULL,
  payment_status varchar(30) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
  payment_time timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table reports
CREATE TABLE reports (
  report_id SERIAL PRIMARY KEY,
  user_id int NOT NULL REFERENCES users (user_id),
  order_id int DEFAULT NULL REFERENCES orders (order_id),
  issue_category varchar(30) NOT NULL,
  issue_type varchar(100) NOT NULL,
  description text NOT NULL,
  status varchar(20) DEFAULT 'pending',
  report_time timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Seeding data for table users
INSERT INTO users (user_id, name, email, password, mobile_no, role, status, created_at) VALUES 
(1,'sabari','sabari@gmail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','7200031210','USER','ACTIVE','2026-03-04 00:36:47'),
(2,'vidya','vidya@gmail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','9486599461','USER','ACTIVE','2026-03-04 04:45:54'),
(3,'System Admin','admin@canteen.com','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','9360970951','MAIN_ADMIN','ACTIVE','2026-03-04 23:56:01'),
(4,'Ravi Kumar','ravikumar@gmail.com','2c755b630bc3405930100536ade01c41b0ab3bf682243055b73e863ad3be7495','9442899461','SHOP_ADMIN','ACTIVE','2026-03-05 00:06:41'),
(5,'Saravanan','saravanan@gmail.com','1150225659848e4d5780f5b45ec832a8503ca88315689ef4fcc7cab1fbdfdb34','9895675564','SHOP_ADMIN','ACTIVE','2026-03-06 11:04:47'),
(6,'Selvam','selvam@gmail.com','5dc7f4d3999d0c474acad15582e8cb488846bbb875de4731d4294e3e4ec03fd4','9489418340','SHOP_ADMIN','ACTIVE','2026-03-06 11:11:21'),
(7,'Thiru','thiru@gmail.com','52c4e8c5d8905aed5b64bfc3ee66ed67a6c4dfc4151d541caba81b913f16cc3f','9094583420','USER','ACTIVE','2026-03-07 06:22:32'),
(8,'Piranow','piranow@gmail.com','0119fa63e51b4937a8c57f7616a948528650e545b93575d86324e67d82d233df','9094822311','USER','ACTIVE','2026-03-07 06:23:18'),
(9,'Sabarithan','sabarithanpalanivel@gmail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','9360980651','USER','ACTIVE','2026-03-08 06:21:57'),
(10,'Shankar','shankar@gmail.com','afd994b3ac535c02453058e1e0b95857eae7c17aa912f046f408bf6216456d8c','9687430576','SHOP_ADMIN','ACTIVE','2026-03-08 16:33:13'),
(11,'Sathya','sathya@gmail.com','7c84846f51a1dbd626bb877de0bce1008c16f7fe3d9f70c40547156379023c69','8708957323','SHOP_ADMIN','ACTIVE','2026-03-08 17:00:44'),
(12,'Shiva','shiva@gmail.com','31a79bb331fac359221c292b76428f08ad29f55a2257e4e88dc996e84c016203','9670783172','SHOP_ADMIN','ACTIVE','2026-03-08 17:05:48');

-- Seeding data for table shops
INSERT INTO shops (shop_id, shop_name, shop_admin_id, status) VALUES 
(1,'MAIN CANTEEN',4,'OPEN'),
(2,'RISHABH FOOD COURT ',5,'OPEN'),
(3,'SNOW CUBE',6,'OPEN'),
(4,'ASWINS',10,'OPEN'),
(5,'NILAVANS',11,'OPEN'),
(6,'METRO CAFE',12,'OPEN');

-- Seeding data for table menu
INSERT INTO menu (menu_id, shop_id, item_name, price, category, availability_status) VALUES 
(1,1,'Tea',10.00,'BEVERAGE','AVAILABLE'),
(2,1,'Coffee',15.00,'BEVERAGE','AVAILABLE'),
(3,1,'Boost',15.00,'BEVERAGE','AVAILABLE'),
(4,1,'Filter coffee',20.00,'BEVERAGE','AVAILABLE'),
(5,1,'Lemon Tea',10.00,'BEVERAGE','AVAILABLE'),
(6,1,'Lemon',20.00,'JUICE','AVAILABLE'),
(7,1,'Pine Lemon',30.00,'JUICE','AVAILABLE'),
(8,1,'Grape Lemon',30.00,'JUICE','AVAILABLE'),
(9,1,'RoseMilk',40.00,'JUICE','AVAILABLE'),
(10,1,'Watermelon',30.00,'JUICE','AVAILABLE'),
(11,1,'Pineapple',30.00,'JUICE','AVAILABLE'),
(12,1,'Cold Boost',50.00,'JUICE','AVAILABLE'),
(13,1,'Veg Kothu Parotta',70.00,'VEG','AVAILABLE'),
(14,1,'Chikken Kothu Parotta',100.00,'NON_VEG','AVAILABLE'),
(15,1,'Egg Kothu Parotta',80.00,'NON_VEG','AVAILABLE'),
(16,1,'Chilly Egg',65.00,'STARTERS','AVAILABLE'),
(17,1,'Chilly Mushroom',75.00,'STARTERS','AVAILABLE'),
(18,1,'Chilly Gobi',75.00,'STARTERS','AVAILABLE'),
(19,1,'Chicken manchurian',100.00,'STARTERS','AVAILABLE'),
(20,1,'Paneer manchurian',90.00,'STARTERS','AVAILABLE'),
(21,1,'Chikken 65',120.00,'STARTERS','AVAILABLE'),
(22,1,'Paneer 65',100.00,'STARTERS','AVAILABLE'),
(23,1,'Veg Noodles',60.00,'CHINESE','AVAILABLE'),
(24,1,'Gobi Noodles',70.00,'CHINESE','AVAILABLE'),
(25,1,'Paneer Noodles',90.00,'CHINESE','AVAILABLE'),
(26,1,'Egg Noodle',80.00,'CHINESE','AVAILABLE'),
(27,1,'Chicken Noodles',100.00,'CHINESE','AVAILABLE'),
(28,1,'Chapathi(2)',30.00,'VEG','AVAILABLE'),
(29,1,'Parotta(3)',50.00,'VEG','AVAILABLE'),
(30,1,'Plain Dosa',30.00,'VEG','AVAILABLE'),
(31,1,'Kal Dosa',20.00,'VEG','AVAILABLE'),
(32,1,'Paneer Dosa',70.00,'VEG','AVAILABLE'),
(33,1,'Egg Dosa',70.00,'NON_VEG','AVAILABLE'),
(34,1,'Chikken Dosa',80.00,'NON_VEG','AVAILABLE'),
(35,1,'Paneer Podi Dosa',80.00,'VEG','AVAILABLE'),
(36,1,'Masala Dosa',70.00,'VEG','AVAILABLE'),
(37,1,'Poori(3)',30.00,'VEG','AVAILABLE'),
(38,1,'Banana Cake',15.00,'SNACKS','AVAILABLE'),
(39,1,'Peanut Burfi',5.00,'SNACKS','AVAILABLE'),
(40,1,'Kalaki',15.00,'Egg','AVAILABLE'),
(41,1,'Omlet',15.00,'Egg','AVAILABLE'),
(42,1,'Double Omlet',30.00,'Egg','AVAILABLE'),
(43,1,'Egg Podimas',50.00,'Egg','AVAILABLE'),
(44,2,'Tea',10.00,'BEVERAGE','AVAILABLE'),
(45,2,'Mango',50.00,'JUICE','AVAILABLE');

-- Seeding data for table orders
INSERT INTO orders (order_id, user_id, shop_id, token_number, status, order_time, order_date) VALUES 
(1,1,1,1,'COMPLETED','2026-03-07 16:18:01','2026-03-07'),
(2,1,1,2,'PENDING','2026-03-07 16:20:49','2026-03-07'),
(18,1,1,1,'COMPLETED','2026-03-09 12:24:36','2026-03-09'),
(19,1,1,2,'CANCELLED','2026-03-09 13:17:13','2026-03-09'),
(20,2,1,3,'COMPLETED','2026-03-09 13:27:21','2026-03-09'),
(21,2,1,4,'CANCELLED','2026-03-09 13:27:27','2026-03-09'),
(22,1,1,1,'COMPLETED','2026-03-11 07:08:07','2026-03-11'),
(23,1,1,2,'COMPLETED','2026-03-11 07:08:25','2026-03-11'),
(24,1,1,3,'COMPLETED','2026-03-11 07:13:35','2026-03-11'),
(25,1,1,4,'COMPLETED','2026-03-11 07:13:49','2026-03-11'),
(26,1,1,5,'COMPLETED','2026-03-11 07:18:00','2026-03-11'),
(27,1,1,6,'COMPLETED','2026-03-11 07:18:22','2026-03-11'),
(28,1,1,7,'CANCELLED','2026-03-11 07:34:17','2026-03-11'),
(29,1,1,8,'PAYMENT_PENDING','2026-03-11 07:35:35','2026-03-11'),
(30,1,1,9,'COMPLETED','2026-03-11 07:36:06','2026-03-11'),
(31,1,1,10,'CANCELLED','2026-03-11 07:36:47','2026-03-11'),
(32,1,1,11,'CANCELLED','2026-03-11 07:41:54','2026-03-11'),
(33,1,1,12,'CANCELLED','2026-03-11 07:42:30','2026-03-11'),
(34,1,1,13,'CANCELLED','2026-03-11 07:44:51','2026-03-11'),
(35,1,1,14,'CANCELLED','2026-03-11 07:48:16','2026-03-11'),
(36,1,1,15,'PAYMENT_PENDING','2026-03-11 07:50:43','2026-03-11'),
(37,1,1,16,'COMPLETED','2026-03-11 07:51:02','2026-03-11'),
(38,1,1,17,'CANCELLED','2026-03-11 07:52:31','2026-03-11'),
(39,1,1,18,'CANCELLED','2026-03-11 07:52:50','2026-03-11'),
(40,1,1,19,'CANCELLED','2026-03-11 07:53:44','2026-03-11'),
(41,1,1,20,'COMPLETED','2026-03-11 07:54:16','2026-03-11'),
(42,1,1,21,'CANCELLED','2026-03-11 07:54:34','2026-03-11'),
(43,1,1,22,'COMPLETED','2026-03-11 07:57:02','2026-03-11'),
(44,1,1,23,'CANCELLED','2026-03-11 07:57:18','2026-03-11'),
(45,1,1,24,'COMPLETED','2026-03-11 07:57:24','2026-03-11'),
(46,1,1,25,'CANCELLED','2026-03-11 07:59:09','2026-03-11'),
(47,1,1,26,'CANCELLED','2026-03-11 08:02:01','2026-03-11'),
(48,1,1,27,'COMPLETED','2026-03-11 08:04:43','2026-03-11'),
(49,2,1,1,'COMPLETED','2026-03-13 14:54:33','2026-03-13'),
(50,2,1,1,'CANCELLED','2026-03-14 12:52:59','2026-03-14'),
(51,2,1,2,'CANCELLED','2026-03-14 12:53:52','2026-03-14'),
(52,2,1,3,'CANCELLED','2026-03-14 13:31:02','2026-03-14'),
(53,1,1,4,'PENDING','2026-03-14 13:39:35','2026-03-14'),
(54,1,2,1,'COMPLETED','2026-03-14 13:39:44','2026-03-14'),
(55,1,1,1,'COMPLETED','2026-03-15 04:34:49','2026-03-15'),
(56,2,1,2,'COMPLETED','2026-03-15 04:40:34','2026-03-15'),
(57,2,2,1,'PENDING','2026-03-15 04:40:56','2026-03-15'),
(58,2,1,3,'COMPLETED','2026-03-15 04:41:06','2026-03-15'),
(59,1,1,4,'COMPLETED','2026-03-15 04:41:33','2026-03-15'),
(60,1,1,1,'PENDING','2026-04-02 00:02:32','2026-04-02'),
(61,1,1,2,'COMPLETED','2026-04-02 04:20:37','2026-04-02'),
(62,1,1,3,'PENDING','2026-04-02 04:30:44','2026-04-02'),
(63,1,1,1,'PENDING','2026-04-04 05:51:35','2026-04-04');

-- Seeding data for table order_items
INSERT INTO order_items (order_item_id, order_id, menu_id, quantity, price_at_order) VALUES 
(1,1,1,1,10.00),
(2,2,1,2,10.00),
(3,18,1,2,10.00),
(4,19,1,2,10.00),
(5,20,1,1,10.00),
(6,21,1,2,10.00),
(7,22,1,2,10.00),
(8,23,1,3,10.00),
(9,24,1,2,10.00),
(10,25,1,1,10.00),
(11,26,1,6,10.00),
(12,27,1,1,10.00),
(13,28,1,1,10.00),
(14,29,1,3,10.00),
(15,30,1,4,10.00),
(16,31,1,6,10.00),
(17,32,1,2,10.00),
(18,33,1,1,10.00),
(19,34,1,1,10.00),
(20,35,1,3,10.00),
(21,36,1,4,10.00),
(22,37,1,4,10.00),
(23,38,1,2,10.00),
(24,39,1,3,10.00),
(25,40,1,3,10.00),
(26,41,1,3,10.00),
(27,42,1,4,10.00),
(28,43,1,1,10.00),
(29,44,1,2,10.00),
(30,45,1,2,10.00),
(31,46,1,1,10.00),
(32,47,1,1,10.00),
(33,48,1,2,10.00),
(34,49,27,1,100.00),
(35,49,19,1,100.00),
(36,49,40,1,15.00),
(37,50,6,1,20.00),
(38,50,4,1,20.00),
(39,51,23,1,60.00),
(40,52,1,1,10.00),
(41,52,5,1,10.00),
(42,53,7,1,30.00),
(43,54,45,1,50.00),
(44,55,19,1,100.00),
(45,55,29,1,50.00),
(46,56,5,1,10.00),
(47,56,2,1,15.00),
(48,56,20,1,90.00),
(49,56,17,1,75.00),
(50,57,44,1,10.00),
(51,57,45,1,50.00),
(52,58,1,1,10.00),
(53,59,43,1,50.00),
(54,59,27,1,100.00),
(55,60,1,1,10.00),
(56,61,33,1,70.00),
(57,61,15,1,80.00),
(58,62,33,1,70.00),
(59,62,15,1,80.00),
(60,63,2,1,15.00);

-- Seeding data for table password_resets
INSERT INTO password_resets (id, user_id, otp_code, expiry_time, is_used, created_at) VALUES 
(1,1,'472633','2026-03-08 05:09:42',false,'2026-03-08 05:04:41'),
(2,9,'746617','2026-03-08 06:27:21',true,'2026-03-08 06:22:21'),
(3,9,'340917','2026-03-08 06:29:03',true,'2026-03-08 06:24:03'),
(4,9,'733730','2026-03-08 10:17:54',false,'2026-03-08 10:12:53'),
(5,9,'783899','2026-03-08 10:21:02',false,'2026-03-08 10:16:02'),
(6,9,'780507','2026-03-08 10:22:10',false,'2026-03-08 10:17:09'),
(7,9,'884883','2026-03-08 10:22:48',false,'2026-03-08 10:17:48'),
(8,9,'401320','2026-03-08 10:22:52',false,'2026-03-08 10:17:52'),
(9,9,'476300','2026-03-08 10:25:42',false,'2026-03-08 10:20:42'),
(10,9,'947345','2026-03-08 10:34:34',false,'2026-03-08 10:29:33'),
(11,9,'547893','2026-03-08 10:37:13',false,'2026-03-08 10:32:12'),
(12,9,'708887','2026-03-08 10:39:02',false,'2026-03-08 10:34:01'),
(13,9,'814266','2026-03-09 01:32:02',true,'2026-03-09 01:27:02'),
(14,9,'814074','2026-03-15 04:36:09',false,'2026-03-15 04:31:08'),
(15,9,'878858','2026-04-04 05:53:38',false,'2026-04-04 05:48:38');

-- Seeding data for table payments
INSERT INTO payments (payment_id, order_id, amount, payment_method, payment_gateway, transaction_id, payment_status, payment_time) VALUES 
(1,22,20.00,'ONLINE','FAKE_GATEWAY','60f0f556-f7fd-4298-afb6-e536f44b3977','SUCCESS','2026-03-11 07:08:07'),
(2,23,30.00,'ONLINE','FAKE_GATEWAY','ae7be45a-ed93-4d3e-a71e-5c7782aaa684','FAILED','2026-03-11 07:08:25'),
(3,24,20.00,'ONLINE','FAKE_GATEWAY','52bcf682-0f27-4b7e-8528-affabaa0be6a','FAILED','2026-03-11 07:13:35'),
(4,25,10.00,'ONLINE','FAKE_GATEWAY','1e240ff6-1eb6-4775-a464-a4a3d190e907','SUCCESS','2026-03-11 07:13:49'),
(5,26,60.00,'ONLINE','FAKE_GATEWAY','3c192e5c-cb13-4b6b-bf71-1b6d17a90e21','SUCCESS','2026-03-11 07:18:00'),
(6,27,10.00,'ONLINE','FAKE_GATEWAY','b53af8c7-dc6a-4975-8a23-b00d595c0ae1','FAILED','2026-03-11 07:18:22'),
(7,28,10.00,'ONLINE','FAKE_GATEWAY','aede35d4-5c2e-473e-812d-127b714b329b','FAILED','2026-03-11 07:34:17'),
(8,29,30.00,'ONLINE','FAKE_GATEWAY','0b64dc9d-173d-4b5a-97eb-cd86f6a22d2e','PENDING','2026-03-11 07:35:35'),
(9,30,40.00,'ONLINE','FAKE_GATEWAY','f7cea919-9f2b-40b0-9fe2-4822605838e5','SUCCESS','2026-03-11 07:36:06'),
(10,31,60.00,'ONLINE','FAKE_GATEWAY','6dcfdeca-e810-43d3-b78f-e2ead38c0d42','FAILED','2026-03-11 07:36:47'),
(11,32,20.00,'ONLINE','FAKE_GATEWAY','04fa2eb8-3d45-4b74-8d7c-31af71484b25','FAILED','2026-03-11 07:41:54'),
(12,33,10.00,'ONLINE','FAKE_GATEWAY','73e13769-a17c-40f0-90ae-ed1ea5f76dda','FAILED','2026-03-11 07:42:30'),
(13,34,10.00,'ONLINE','FAKE_GATEWAY','3456caff-729d-4328-bc8c-9ddfc4b4e58f','FAILED','2026-03-11 07:44:51'),
(14,35,30.00,'ONLINE','FAKE_GATEWAY','aa50867d-b19c-45ea-ba2e-52f720594074','FAILED','2026-03-11 07:48:16'),
(15,36,40.00,'ONLINE','FAKE_GATEWAY','b70aca4d-fb43-4f34-8e9a-ae640ec6e563','PENDING','2026-03-11 07:50:43'),
(16,37,40.00,'ONLINE','FAKE_GATEWAY','b19b15e3-7e7d-4e24-a13b-df98acb90b38','SUCCESS','2026-03-11 07:51:02'),
(17,38,20.00,'ONLINE','FAKE_GATEWAY','bf9a29ee-3000-48ad-8e3d-2092ce469f95','FAILED','2026-03-11 07:52:31'),
(18,39,30.00,'ONLINE','FAKE_GATEWAY','d2837659-313b-4daf-8e15-a8aac2bd6be6','FAILED','2026-03-11 07:52:50'),
(19,40,30.00,'ONLINE','FAKE_GATEWAY','e7121a9e-6cb3-4286-8c84-c2ab7aefe575','FAILED','2026-03-11 07:53:44'),
(20,41,30.00,'ONLINE','FAKE_GATEWAY','782e8feb-ef4b-4e97-96c4-bcc4a7667695','SUCCESS','2026-03-11 07:54:16'),
(21,42,40.00,'ONLINE','FAKE_GATEWAY','6b0f8e64-b21d-4b99-b3bd-9e71b6803507','FAILED','2026-03-11 07:54:34'),
(22,43,10.00,'ONLINE','FAKE_GATEWAY','9c1df313-e4bf-4237-9ca0-71463b068a82','SUCCESS','2026-03-11 07:57:02'),
(23,44,20.00,'ONLINE','FAKE_GATEWAY','3f94f019-1bfc-43a1-8b37-263bef817934','FAILED','2026-03-11 07:57:18'),
(24,45,20.00,'ONLINE','FAKE_GATEWAY','8e34a0fb-9dc1-42bd-a551-5febf466a0a5','SUCCESS','2026-03-11 07:57:24'),
(25,46,10.00,'ONLINE','FAKE_GATEWAY','63a316e7-e610-4f3a-8791-0be3efb9df33','FAILED','2026-03-11 07:59:09'),
(26,47,10.00,'ONLINE','FAKE_GATEWAY','856af8b6-bc48-4992-895d-286bd1e4a4ee','FAILED','2026-03-11 08:02:01'),
(27,48,20.00,'ONLINE','FAKE_GATEWAY','4fc197c5-fefb-40f6-9471-069940de12bf','SUCCESS','2026-03-11 08:04:43'),
(28,49,215.00,'ONLINE','FAKE_GATEWAY','20008852-b1af-4bdc-b7d5-816889dcc92f','SUCCESS','2026-03-13 14:54:33'),
(29,50,40.00,'ONLINE','FAKE_GATEWAY','c4290c34-517b-4d5d-93b5-a0d606cf2b39','REFUNDED','2026-03-14 12:52:59'),
(30,51,60.00,'ONLINE','FAKE_GATEWAY','937aaf99-6794-4968-8fdc-c0e761687ac7','REFUNDED','2026-03-14 12:53:52'),
(31,52,20.00,'ONLINE','FAKE_GATEWAY','12cacbf2-2068-484a-b9ba-a3b3972c286f','REFUNDED','2026-03-14 13:31:03'),
(32,53,30.00,'ONLINE','FAKE_GATEWAY','b7c00818-5554-4901-8f8d-c4a8da234da2','SUCCESS','2026-03-14 13:39:35'),
(33,54,50.00,'ONLINE','FAKE_GATEWAY','3b34e843-cfa8-4c02-935f-dafeb6dc42e2','SUCCESS','2026-03-14 13:39:44'),
(34,55,150.00,'ONLINE','FAKE_GATEWAY','d77c20d6-3e39-467e-afd8-fbeebf51c7c8','SUCCESS','2026-03-15 04:34:49'),
(35,56,190.00,'ONLINE','FAKE_GATEWAY','bc48facb-5ac3-40c2-b94b-c31e606aa1d4','SUCCESS','2026-03-15 04:40:34'),
(36,57,60.00,'ONLINE','FAKE_GATEWAY','3d36bea3-db8d-4222-a011-c34b5acc8ac6','SUCCESS','2026-03-15 04:40:56'),
(37,58,10.00,'ONLINE','FAKE_GATEWAY','04e91d28-ff56-46c8-9699-3e63e4e9c44a','SUCCESS','2026-03-15 04:41:06'),
(38,59,150.00,'ONLINE','FAKE_GATEWAY','0f54fa29-2859-4b73-8b77-050ca627918d','SUCCESS','2026-03-15 04:41:33'),
(39,60,10.00,'ONLINE','FAKE_GATEWAY','366973de-0e82-42ef-92f4-e4e14507038a','SUCCESS','2026-04-02 00:02:32'),
(40,61,150.00,'ONLINE','FAKE_GATEWAY','5700936d-fc40-4ac8-9fb2-93c0b089f995','SUCCESS','2026-04-02 04:20:37'),
(41,62,150.00,'ONLINE','FAKE_GATEWAY','8883a7d7-5209-4560-bd34-80f8dfe8287d','SUCCESS','2026-04-02 04:30:44'),
(42,63,15.00,'ONLINE','FAKE_GATEWAY','78e5394d-54ee-4272-91c1-b28f91fec9c0','SUCCESS','2026-04-04 05:51:35');

-- Seeding data for table reports
INSERT INTO reports (report_id, user_id, order_id, issue_category, issue_type, description, status, report_time) VALUES 
(1,1,NULL,'SYSTEM_ISSUE','slow','system is slow','resolved','2026-03-13 10:26:32'),
(2,1,NULL,'SYSTEM_ISSUE','bad ui','ui is not good','rejected','2026-03-13 10:42:30'),
(3,1,48,'ORDER_ISSUE','not good','food is not good','resolved','2026-03-13 10:42:47'),
(4,1,NULL,'SYSTEM_ISSUE','loging issue','my email and password is not working sometimes','pending','2026-04-01 23:56:33'),
(5,1,NULL,'SYSTEM_ISSUE','ui is is not good','aaa','pending','2026-04-02 04:31:56');

-- Reset sequences to the correct starting values (auto-increment matching)
SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 0) + 1, false);
SELECT setval('shops_shop_id_seq', COALESCE((SELECT MAX(shop_id) FROM shops), 0) + 1, false);
SELECT setval('menu_menu_id_seq', COALESCE((SELECT MAX(menu_id) FROM menu), 0) + 1, false);
SELECT setval('orders_order_id_seq', COALESCE((SELECT MAX(order_id) FROM orders), 0) + 1, false);
SELECT setval('order_items_order_item_id_seq', COALESCE((SELECT MAX(order_item_id) FROM order_items), 0) + 1, false);
SELECT setval('password_resets_id_seq', COALESCE((SELECT MAX(id) FROM password_resets), 0) + 1, false);
SELECT setval('payments_payment_id_seq', COALESCE((SELECT MAX(payment_id) FROM payments), 0) + 1, false);
SELECT setval('reports_report_id_seq', COALESCE((SELECT MAX(report_id) FROM reports), 0) + 1, false);
