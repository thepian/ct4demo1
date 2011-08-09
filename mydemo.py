#!/usr/bin/env python
import sys
from os.path import join, dirname, realpath,split

PORT = 44444

def test_redis():
	pass
	
def start_server(script_path,script_name):
	from application import Application, HTTPServer
	import tornado.httpserver
	import tornado.ioloop
	import tornado.autoreload
	
	SITE = {
	"path": join(script_path),
	"dirname": "wwwsite",
	"port":PORT
	}
	
	ioloop = tornado.ioloop.IOLoop.instance()
	http_server = tornado.httpserver.HTTPServer(Application(SITE,ioloop=ioloop))
	http_server.listen(SITE["port"])
	
	tornado.autoreload.start(io_loop=ioloop)
	ioloop.start()

def main(script_path,script_name):
    print "Tornado Server on port %s, logging to testing.log" % (PORT)
    sys.path.append(join(script_path,"Library","mydemo"))
    sys.path.append(join(script_path,"Library","tornado"))

    import logging
    # print 'logging to testing.log', structure.DEFAULT_HOSTNAME
    LOG_FILENAME = join(script_path,'testing.log')
    logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
    
    import site
    setattr(site, "TEMPLATES_DIR", join(script_path,"templates"))
    setattr(site, "CONF_DIR", join(script_path,"conf"))
    setattr(site, "SEED_DIR", join(script_path,"seed"))
    
    start_server(script_path,script_name)
    test_redis()
    
if __name__ == "__main__":
    script_path,script_name = split(realpath(__file__))
    main(script_path,script_name)


        
