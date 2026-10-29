-- Northstar Banking - MySQL 8 Initialization Script
-- Creates dedicated databases for each microservice

CREATE DATABASE IF NOT EXISTS authdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS customerdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS accountdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions if necessary
GRANT ALL PRIVILEGES ON authdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON customerdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON accountdb.* TO 'root'@'%';
FLUSH PRIVILEGES;
