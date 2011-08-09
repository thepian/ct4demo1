from handlers import *
from tornado import web
import site

wwwsite = [
	(r"^/$", HomeHandler),
	(r"/css/(.*)", web.StaticFileHandler, { "path":site.CSS_DIR }),
	(r"/demo/(.*)", DemoHandler),
]