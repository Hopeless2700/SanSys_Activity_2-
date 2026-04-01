# Smart Farm Backend (XAMPP + MySQL)

This backend is compatible with:
- Arduino UNO R4 WiFi node posting to `POST /api/sensor`
- Frontend dashboard reading from:
  - `GET /api/sensors`
  - `GET /api/sensor/{id}`
  - `GET /api/sensor/{id}/history`
  - `GET /api/sensor/{id}/stats`

## 1. Deploy to XAMPP

1. Open your XAMPP install folder.
2. Copy this `Backend` folder into `htdocs` and rename it to `sansys-backend`.

Your structure should look like this:

~~~text
C:\xampp\htdocs\sansys-backend\api\index.php
C:\xampp\htdocs\sansys-backend\config\db.php
C:\xampp\htdocs\sansys-backend\database\schema.sql
~~~

3. Start Apache and MySQL in XAMPP Control Panel.

## 2. Create Database

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Import [database/schema.sql](database/schema.sql)

Or run in MySQL:

~~~sql
SOURCE C:/xampp/htdocs/sansys-backend/database/schema.sql;
~~~

## 3. Apache Rewrite Requirement

This API uses route rewriting with `.htaccess`.

- Ensure Apache `mod_rewrite` is enabled.
- Ensure `AllowOverride All` is allowed for `htdocs`.

Then restart Apache.

## 4. Test API Quickly

### Arduino ingest simulation

~~~bash
curl -X POST http://localhost/sansys-backend/api/sensor \
  -H "Content-Type: application/json" \
  -d "{\"sensor_id\":\"NODE_03\",\"location\":\"Pasay_Station\",\"temperature\":30.2,\"humidity\":70.1,\"ldr_raw\":750,\"daytime\":true}"
~~~

### Dashboard endpoints

~~~bash
curl http://localhost/sansys-backend/api/sensors
curl http://localhost/sansys-backend/api/sensor/NODE_03
curl http://localhost/sansys-backend/api/sensor/NODE_03/history
curl http://localhost/sansys-backend/api/sensor/NODE_03/stats
~~~

## 5. Arduino Settings for XAMPP Backend

Use these values in your Arduino sketch:

~~~cpp
const char* SERVER_HOST = "192.168.43.42"; // PC IP on same WiFi as Arduino
const int   SERVER_PORT = 80;
const char* SERVER_PATH = "/sansys-backend/api/sensor";
~~~

Notes:
- `SERVER_HOST` must be your computer LAN IP (not localhost).
- Arduino and PC must be connected to the same WiFi network.
- Allow Apache in Windows Firewall private networks.

## 6. Frontend Configuration

Frontend is already configured in [.env](../Frontend/.env) to:

~~~env
REACT_APP_API_URL=http://localhost/sansys-backend/api
~~~

Run frontend:

~~~bash
cd Frontend
npm install
npm start
~~~
