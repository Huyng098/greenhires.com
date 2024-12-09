
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

## api https
sudo nano /etc/nginx/sites-available/api.greenhires.com

# add on the following lines
```
server {
    server_name api.greenhires.com www.api.greenhires.com;

    location / {
        proxy_pass http://localhost:8955;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```
## Enable the new configuration:
sudo ln -s /etc/nginx/sites-available/api.greenhires.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

## Obtain an SSL certificate using Certbot:
sudo certbot --nginx -d api.greenhires.com

## Certbot will modify your Nginx configuration to include SSL settings. see the changes 
cat /etc/nginx/sites-available/api.greenhires.com

## Remember to keep your SSL certificate up to date. 
## Certbot typically sets up automatic renewals, but you can check the renewal status with:
sudo certbot renew --dry-run

