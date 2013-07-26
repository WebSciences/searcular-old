from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Permission,Group
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.template import Context,loader
from django.utils.functional import lazy
from django.views.generic import CreateView

from .forms import UserCreationForm
from pinry.users.models import User
from pinry.core.models import Rawquerylog,Userquerysession,Querysessiondetail,Query,Webpageurl

from django.shortcuts import render

reverse_lazy = lambda name=None, *args: lazy(reverse, str)(name, args=args)


class CreateUser(CreateView):
    template_name = 'users/register.html'
    model = User
    form_class = UserCreationForm
    success_url = reverse_lazy('core:recent-pins')

    def get(self, request, *args, **kwargs):
        if not settings.ALLOW_NEW_REGISTRATIONS:
            messages.error(request, "The admin of this service is not allowing new registrations.")
            return HttpResponseRedirect(reverse('core:recent-pins'))
        return super(CreateUser, self).get(request, *args, **kwargs)

    def form_valid(self, form):
        redirect = super(CreateUser, self).form_valid(form)
        group = Group.objects.get(name = 'default')
        permissions = Permission.objects.filter(codename__in=['add_pin', 'add_image','core'])

        user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])
        user.user_permissions = permissions
        user.groups = [group]
        login(self.request, user)
        return redirect


@login_required
def logout_user(request):
    logout(request)
    messages.success(request, 'You have successfully logged out.')
    return HttpResponseRedirect(reverse('core:recent-pins'))


def private(request):
    return TemplateResponse(request, 'users/private.html', None)

def delete_querysession(request, id):
   query_session_obj = Userquerysession.objects.get(pk = id)
   query_session_obj.delete()
   return HttpResponseRedirect('/profile/')


def profile(request):
    user_id = request.user.pk
    
    query_session_metas=Userquerysession.objects.filter(submitter_id = user_id).order_by('-created_time')
    query_sessions = []

    for item in query_session_metas:

        details = Querysessiondetail.objects.filter(querysession = item.id,iscompleted = True).order_by('timestamp')
        if details.exists():
            #check if result exists
            query_session = {}
            query_session['meta'] = item
            query_session['details'] = details

            query_sessions.append(query_session)
    
    # keyword_ids = Querysessiondetail.objects.filter(submitter = user_id ).values_list('query',flat = True).distinct()
    # keyword_dict = Query.objects.filter(id__in = keyword_ids)
    # keywords = {}
    # for item in keyword_dict:
    #     keywords[item.id] = item.keyword

    # pageurl_ids = Querysessiondetail.objects.filter(submitter = user_id ).values_list('url_id',flat = True).distinct()
    # pageurl_dict = Webpageurl.objects.filter(id__in = pageurl_ids)
    # pageurls = {}
    # for item in pageurl_dict:
    #     keywords[item.id] = {'url':item.url, 'query_id':item.query_id}

    rawquery = Rawquerylog.objects.filter(submitter = user_id)
    
    context = {'query_sessions':query_sessions ,'raw':rawquery}



    return render(request,'users/profile.html',context)
