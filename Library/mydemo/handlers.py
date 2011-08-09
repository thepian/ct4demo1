import tornado.web

class HomeHandler(tornado.web.RequestHandler):
    
    def get(self):
        info = {
            "MEDIA_URL": "",
            "SITE_TITLE": "CT4 Demo",
        }
        self.render("home.html",**info)
        
    def post(self):
        if "stop-server" in self.request.arguments.keys():
            self.application.ioloop.stop()
        self.write('done.')

class DemoHandler(tornado.web.RequestHandler):
    
    def get(self,template_name):
        info = {
            "MEDIA_URL": "",
            "SITE_TITLE": "CT4 Demo",
        }
        self.render("%s.html" % template_name,**info)
        
