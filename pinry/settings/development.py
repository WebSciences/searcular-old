from pinry.settings import *

import os


# BROKER_URL = 'redis://localhost:6379/0'
# BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 3600}  # 1 hour.
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'



DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(SITE_ROOT, 'development.db'),
	'USER': '',
	'PASSWORD': '',
	'HOST': '',
	'PORT': '',
    }
}

SECRET_KEY = 'fake-key'
