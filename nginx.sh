rm /var/www/html/* -rf
cp dist/* /var/www/html/ -r
# systemctl restart nginx.service