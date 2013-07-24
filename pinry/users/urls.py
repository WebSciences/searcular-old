from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from .views import CreateUser
from pinry.core.models import Rawquerylog

urlpatterns = patterns('',
    url(r'^private/$', 'pinry.users.views.private', name='private'),
    url(r'^register/$', CreateUser.as_view(), name='register'),
    url(r'^login/$', 'django.contrib.auth.views.login',
        {'template_name': 'users/login.html'}, name='login'),
    url(r'^logout/$', 'pinry.users.views.logout_user', name='logout'),
    url(r'^profile/$','pinry.users.views.profile',name='profile'),
    url(r'^profile/querysession/delete/(\d+)/$','pinry.users.views.delete_querysession'),
)
