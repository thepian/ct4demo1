import tornado.web

class LayoutHandler(tornado.web.RequestHandler):
    
    def get(self,layout_id):
        info = {
            "MEDIA_URL": "",
            "SITE_TITLE": "CT4 Demo",
            "site": self.application.site,
        }
        self.render("base.html",**info) # layouts/desktop.layout.html
        
    def post(self):
        if "stop-server" in self.request.arguments.keys():
            self.application.ioloop.stop()
        self.write('done.')

