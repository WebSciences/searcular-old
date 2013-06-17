Searcular: a social search and discovery engine.

1) the git clone is allocated at /var/www/v2.searcular.com/searcular in searcular.com using my account seawan

2) the cloned source codes serve http://v2.searcular.com using an apache web server:
    the virtual machine setting can be found at: 
    /etc/apache2/sites-enabled/

3) to update the source code in the v2.searcular.com server:

    a) go to folder /var/www/v2.searcular.com/searcular

    b) git pull 
    
    c) test http://v2.searcular.com particularly the save function

    the following is to make sure the file permissions correct(may not be necessary)

    d) sudo chown -R www-data:www-data /var/www 

    e)sudo chmod -R g+rw /var/www

    f)find /var/www -type d -print0 | sudo xargs -0 chmod g+s
    




     