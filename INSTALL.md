# backoffice.legendatours.com

## Update
```
ip addr
```
```
yum update
reboot
```

## Create User
```
adduser rafael
passwd rafael
gpasswd -a rafael wheel
```

## Enable Cockpit (optional)
```
systemctl enable --now cockpit.socket
firewall-cmd --remove-service=cockpit
```

## Install nginx
```
yum install nginx
systemctl start nginx
systemctl enable nginx
```
```
setsebool httpd_can_network_connect 1 -P
```
```
firewall-cmd --permanent --zone=public --add-service=http 
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --reload
```
```
mkdir -p /srv/nginx/certbot/.well-known
chown -R nginx:nginx /srv/nginx
```
```
# /etc/nginx/conf.d/backoffice.conf

server {
    listen       80;
    server_name  backoffice.legendatours.com 108.61.165.71;

    root         /srv/nginx/backoffice;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }

    location /.well-known/ {
        root /srv/nginx/certbot;
    }
}
```
```
systemctl restart nginx
```

## Install Certbot

```
wget https://dl.eff.org/certbot-auto
sudo mv certbot-auto /usr/local/bin/certbot-auto
sudo chown root /usr/local/bin/certbot-auto
sudo chmod 0755 /usr/local/bin/certbot-auto
```
```
/usr/local/bin/certbot-auto
# CTRL+c after install
```
```
chcon -v -R --type=httpd_sys_content_t /srv/nginx/certbot
```
```
/usr/local/bin/certbot-auto certonly --webroot -w /srv/nginx/certbot -d backoffice.legendatours.com
```
```
# /etc/nginx/conf.d/backoffice.conf

server {
    listen       80;
    listen       443 default_server ssl;
    server_name  backoffice.legendatours.com 108.61.165.71;

    ssl                  on;
    ssl_certificate      /etc/letsencrypt/live/backoffice.legendatours.com/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/backoffice.legendatours.com/privkey.pem;
    ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers          HIGH:!aNULL:!MD5;
    # ssl_prefer_server_ciphers on;

    # force ssl
    if ($scheme = 'http') {
        return 301 https://$server_name$request_uri;
    }

    location / {
        proxy_pass       http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    }

    location /.well-known/ {
        root /srv/nginx/certbot;
    }
}
```
```
systemctl restart nginx
```

## Install PostgreSQL
```
# install packages
sudo yum install postgresql-server postgresql-contrib

# init
sudo postgresql-setup initdb

# edit ident => md5
sudo nano /var/lib/pgsql/data/pg_hba.conf
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# change password
sudo -u postgres psql
postgres=# \password

# connecting
psql -h 127.0.0.1 -U postgres
```

```
# set .pgpass
echo "127.0.0.1:5432:*:postgres:postgres" > ~/.pgpass
chmod 0600 ~/.pgpass
```

## Install Java
```
yum install java-1.8.0-openjdk-headless
java -version
```

## Deploy Backoffice

```
mkdir -p /srv/backoffice
chown -R nginx:nginx /srv/backoffice
```

```
cp backoffice-1.0-SNAPSHOT.jar /srv/backoffice/
cp config.yml /srv/backoffice/
chown -R nginx:nginx /srv/backoffice
```

```
# /etc/systemd/system/backoffice.service

[Unit]
Description=backoffice.legendatours.com service

[Service]
WorkingDirectory=/srv/backoffice
ExecStart=/usr/bin/java -Xms96m -Xmx96m -jar backoffice-0.1-SNAPSHOT.jar server config.yml
User=root
Type=simple
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```
# TODO INIT DB
```

```
systemctl start backoffice
systemctl status backoffice
systemctl enable backoffice
```
