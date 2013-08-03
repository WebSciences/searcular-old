import hashlib
import os
import urllib
from urlparse import urlparse , urldefrag , parse_qs

def upload_path(instance, filename, **kwargs):
    hasher = hashlib.md5()
    for chunk in instance.image.chunks():
        hasher.update(chunk)
    hash = hasher.hexdigest()
    base, ext = os.path.splitext(filename)
    return '%(first)s/%(second)s/%(hash)s/%(base)s%(ext)s' % {
        'first': hash[0],
        'second': hash[1],
        'hash': hash,
        'base': base,
        'ext': ext,
    }

def extract_query_from_url(url):
    #get original url and it's fragment if exists
    keyword = ''
    url_tuple = urldefrag(url)
    if url_tuple[1] :
        #fragment exists , extract query from fragment
        result = parse_qs(url_tuple[1])
        query = result['q']
        keyword = query[0]
    else:
        #no fragment , extract query from url
        url_object = urlparse(url_tuple[0])
        result = parse_qs(url_object.query)
        if 'q' in result.keys():
            query = result['q']
            keyword = query[0]
    #query[0] = unicode(query[0],'utf8')
    return keyword

