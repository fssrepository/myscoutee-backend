Commands
--------
sudo ufw allow 'Nginx Full' (firewall check for 80/443)
ssh -L 5005:localhost:5005 your-user@myscoutee.com (debug port)

ng serve --ssl
ng serve --host 0.0.0.0 --port 4200

git submodule sync
git submodule update --init --remote

git config --global user.email {email}
git config --global user.name {name}
git config --global user.password {personal access token - Profile -> Settings -> Develpoper Settings (last menu item)}

gradle build
docker compose build --no-cache
docker compose up

adb kill-server
adb start-server
adb devices

Ctrl+Shift+P → Java: Clean Java Language Server Workspace

ng build --source-map --optimization=false --named-chunks
source-map-explorer ./dev/*.js

install VPS
-----------
sudo dpkg -i myscoutee_1.0.0_amd64.deb
sudo nano /etc/myscoutee/myscoutee.env
sudo nano /etc/myscoutee/myscoutee.secrets.env
sudo systemctl start myscoutee
sudo systemctl status myscoutee

optional affinity change-stream wakeups
---------------------------------------
Set this in /etc/myscoutee/myscoutee.env before start:
MONGO_REPLICA_SET_ENABLED=true