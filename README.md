Searcular: a social search and discovery engine.

1) the git clone is allocated at /var/www/v2.searcular.com/searcular in searcular.com using my account seawan

2) the clone source codes serves v2.searcular.com using apache web server:
    the virtual machine setting can be found at: 
    /etc/apache2/sites-enabled/

3) to update the source code in the v2.searcular.com server:

    a) go to folder /var/www/v2.searcular.com/searcular

    b) git pull 

    the following is to make sure the file permissions (may not be necessary)

    c) sudo chown -R www-data:www-data /var/www 

    d)sudo chmod -R g+rw /var/www

    e)find /var/www -type d -print0 | sudo xargs -0 chmod g+s
    




     