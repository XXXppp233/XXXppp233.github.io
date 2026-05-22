rm /var/www/html/* -rf
cp dist/* /var/www/html/
# systemctl restart nginx.service