sudo apt install postgresql -y
sudo -i -u postgres
psql
create user "heuuu" with CREATEDB CREATEROLE REPLICATION LOGIN SUPERUSER ENCRYPTED PASSWORD 'heuuu';
CREATE DATABASE heuuu with owner heuuu;
exit
exit