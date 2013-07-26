from pinry.core.models import Rawquerylog

class Public(object):
    def process_response(self, request, response):
    	#filter the rawquerylog bulk request
    	if response.status_code == 202 and request.path == '/api/v1/rawquerylog/' and request.method == 'PATCH':
    		#process the rawquery log ,extract query pattern

    		#TODO trigger an async process
    		Rawquerylog.objects.extract_query_pattern()

    	return response
