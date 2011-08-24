from handlers import *
from tornado import web
import site

from layouts.handlers import *

wwwsite = [
	(r"^/$", HomeHandler),
	# serve default layout as home with login
	
	(r"^/layouts/([^/]+)/$", LayoutHandler),
	
	(r"/images/(.*)", web.StaticFileHandler, { "path":site.IMAGES_DIR }),
	(r"/js/(.*)", web.StaticFileHandler, { "path":site.JS_DIR }),
	(r"/css/(.*)", web.StaticFileHandler, { "path":site.CSS_DIR }),
	(r"/demo/(.*)", DemoHandler),
]