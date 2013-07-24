import requests,datetime
from cStringIO import StringIO

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models, transaction

from django_images.models import Image as BaseImage, Thumbnail
from taggit.managers import TaggableManager

from ..users.models import User
from utils import extract_query_from_url
from urlparse import urlparse



class ImageManager(models.Manager):
    # FIXME: Move this into an asynchronous task
    def create_for_url(self, url):
        file_name = url.split("/")[-1]
        buf = StringIO()
        response = requests.get(url)
        buf.write(response.content)
        obj = InMemoryUploadedFile(buf, 'image', file_name,
                                   None, buf.tell(), None)
        # create the image and its thumbnails in one transaction, removing
        # a chance of getting Database into a inconsistent state when we
        # try to create thumbnails one by one later
        image = self.create(image=obj)
        for size in settings.IMAGE_SIZES.keys():
            Thumbnail.objects.get_or_create_at_size(image.pk, size)
        return image


class Image(BaseImage):
    objects = ImageManager()

    class Meta:
        proxy = True

class Query(models.Model):
    keyword = models.TextField(blank=True,null=True)

class Pin(models.Model):
    submitter = models.ForeignKey(User)
    url = models.URLField(null=True)
    origin = models.URLField(null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ForeignKey(Image, related_name='pin')
    published = models.DateTimeField(auto_now_add=True)
    tags = TaggableManager()
    

    def __unicode__(self):
        return self.url



class Webpageurl(models.Model):
    url = models.URLField(null=True)
    query = models.ForeignKey(Query)

class Queryitem(models.Model):
    objectid = models.ForeignKey(Pin)
    query = models.ForeignKey(Query)

class Userquerysession(models.Model):
    submitter = models.ForeignKey(User)
    created_time = models.DateTimeField(auto_now=False, auto_now_add=True,null=True)
    last_query = models.ForeignKey(Query,null=True,blank=True) 

class Querysessiondetail(models.Model):
    ACTION_CHOICES = (
        ('EQ', 'enter or renew'),
        ('SR', 'search'),
        ('CR', 'create new page'),
        ('JP', 'jump to new page'),
        ('SW', 'swith page'),
        ('CL', 'close page'),
        ('LQ', 'leave'),
    )
    querysession = models.ForeignKey(Userquerysession)
    submitter = models.ForeignKey(User)
    timestamp = models.DateTimeField()
    tab_id = models.CharField(max_length=4,null = True , blank = True)
    parent = models.ForeignKey('self',blank=True,null = True)
    action = models.CharField(max_length=2,choices=ACTION_CHOICES)
    url = models.ForeignKey(Webpageurl, blank=True, null=True)
    query = models.ForeignKey(Query, blank=True, null=True)
    iscompleted = models.BooleanField(default=False)

class Comments(models.Model):
    submitter = models.ForeignKey(User)
    comment = models.CharField(default="none",max_length=500,null=True,
blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    objectid = models.ForeignKey(Pin)

class Like(models.Model):
    objectid = models.ForeignKey(Pin)
    number = models.IntegerField(default="0")

class RawquerylogManager(models.Manager):
    
    def extract_query_pattern(self):
        submitter_list = self.filter(isprocessed = False).values_list('submitter').distinct()
        for s in submitter_list:
            submitter_id = s[0]
            user_obj = User.objects.get(id = submitter_id)
            
            query_log_set = self.filter(submitter = submitter_id,isprocessed = False).order_by('timestamp')
            
            parent_dict = {}
            
            querysession_obj = None
            
            for item in query_log_set:
                if item.action =='EQ':
                    #enter query session
                    #create a new querysession object
                    querysession_obj = Userquerysession.objects.create(submitter = user_obj)

                    tab_id = item.additional
                    
                    detail_obj = Querysessiondetail.objects.create(submitter = item.submitter,
                        timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                        action = item.action,
                        tab_id = tab_id,
                        querysession = querysession_obj)
                    parent_dict[tab_id] = detail_obj
                    
                elif item.action =='CR':
                    additional_list = item.additional.split();
                    old_tab_id = additional_list[1]
                    tab_id = additional_list[0]
                    
                    detail_obj = Querysessiondetail.objects.create(submitter = user_obj,
                            timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                            action = item.action,
                            tab_id = tab_id,
                            querysession = querysession_obj,
                            parent = parent_dict[old_tab_id],
                            query = parent_dict[old_tab_id].query)
                    
                    parent_dict[tab_id] = detail_obj
                
                elif item.action == 'JP':
                    #skip the empty JP
                    if item.additional :
                        additional_list = item.additional.split()
                        tab_id = additional_list[0]
                        if parent_dict[tab_id]:

                            url = additional_list[1]
                            print url
                            # if it is a google url
                            url_element = urlparse(url)

                            if url_element.netloc.find('www.google.')>=0 and url_element.path.find('search')>=0:
                            #extract the query term
                                query_term = extract_query_from_url(url)
                            #save the query term
                                query_obj,created = Query.objects.get_or_create(keyword = query_term)
                                querysession_obj.last_query = query_obj
                            
                                detail_obj = Querysessiondetail.objects.create(submitter = user_obj,
                                    timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                                    action = 'SR',
                                    query = query_obj,
                                    tab_id = tab_id,
                                    querysession = querysession_obj,
                                    parent = parent_dict[tab_id])
                            
                                #update the parent dictionary
                                parent_dict[tab_id] = detail_obj

                            #no google url
                            else:
                            #save url object
                                url_obj , created = Webpageurl.objects.get_or_create(url = url ,
                                    query = parent_dict[tab_id].query)

                                detail_obj = Querysessiondetail.objects.create(submitter = user_obj,
                                    timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                                    action = item.action,
                                    query = parent_dict[tab_id].query,
                                    url = url_obj,
                                    tab_id = tab_id,
                                    querysession = querysession_obj,
                                    parent = parent_dict[tab_id])
                            
                                #update the parent dictionary
                                parent_dict[tab_id] = detail_obj

                elif item.action == 'SW' or item.action == 'CL':
                    tab_id = item.additional
                    
                    detail_obj = Querysessiondetail.objects.create(submitter = item.submitter,
                        timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                        action = item.action,
                        tab_id = tab_id,
                        parent = parent_dict[tab_id],
                        querysession = querysession_obj)
                
                elif item.action == 'LQ':
                    detail_obj = Querysessiondetail.objects.create(submitter = item.submitter,
                        timestamp = datetime.datetime.fromtimestamp(item.timestamp / 1e3),
                        action = item.action,
                        querysession = querysession_obj)
                    #get all the logs just inserted , and set iscompledted flag to true
                    detail_set = Querysessiondetail.objects.filter(querysession = querysession_obj).update(iscompleted = True)
                    querysession_obj.save()

                    #clear parent_dict and querysession_obj 
                    parent_dict = {}

                    querysession_obj = None
            query_log_set.update(isprocessed = True)

class Rawquerylog(models.Model):
    ACTION_CHOICES = (
        ('EQ', 'enter or renew'),
        ('CR', 'create new page'),
        ('JP', 'jump to new page'),
        ('SW', 'swith page'),
        ('CL', 'close page'),
        ('LQ', 'leave'),
    )
    submitter = models.ForeignKey(User)
    timestamp = models.IntegerField()
    action = models.CharField(max_length=2,choices=ACTION_CHOICES)
    additional = models.CharField(default="none",max_length=500,null=True, blank=True)
    isprocessed = models.BooleanField(default=False)

    objects = RawquerylogManager()

