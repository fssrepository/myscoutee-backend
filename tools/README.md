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
ip a
scp ../packaging/dist/myscoutee_1.0.0_amd64.deb myscoutee@{ip_address}:/tmp/

# Use apt for the local deb so Docker and Compose dependencies are installed.
sudo apt install /tmp/myscoutee_1.0.0_amd64.deb
(or ssh myscoutee@{ip_address} 'sudo apt install /tmp/myscoutee_1.0.0_amd64.deb')
sudo nano /etc/myscoutee/myscoutee.env
# Mongo root/app passwords and the MinIO root password are generated on first install; add external API keys if needed.
sudo nano /etc/myscoutee/myscoutee.secrets.env
sudo systemctl start myscoutee
sudo systemctl status myscoutee
ssh myscoutee@{ip_address} 'sudo bash /opt/myscoutee/packaging/scripts/smoke-mongo-compatibility.sh'

optional affinity change-stream wakeups
---------------------------------------
Set this in /etc/myscoutee/myscoutee.env before start:
MONGO_REPLICA_SET_ENABLED=true

ssh -L 8080:127.0.0.1:80 myscoutee@{ip_address}
