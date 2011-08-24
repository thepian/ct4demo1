import re
import tornado.web

def get_browser_type(userAgent):
    """
    http://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/OptimizingforSafarioniPhone/OptimizingforSafarioniPhone.html#//apple_ref/doc/uid/TP40006517-SW3
    http://wurfl.sourceforge.net/python/index.php
    http://www.zytrax.com/tech/web/mobile_ids.html
    
    http://webservices.usc.edu/blog/development/mobile_detection/
    
    Samples:
    Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10
    Mozilla/5.0 (iPhone; U; CPU iOS 2_0 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/XXXXX Safari/525.20
    
    """
    MOBILE = re.compile(r" Mobile[/ ]")
    IPAD = re.compile(r"\(iPad;")

    if MOBILE.search(userAgent):
        if IPAD.search(userAgent):
            return "tablet"
        if re.search(r"A43 ",userAgent) or re.search(r"X2 ",userAgent):
            return "tablet"
        return "mobile"

    return "desktop"

class LayoutHandler(tornado.web.RequestHandler):
    
    def get(self,layout_id):
        info = {
            "MEDIA_URL": "",
            "SITE_TITLE": "CT4 Demo",
            "site": self.application.site,
        }
        browser_type = get_browser_type( self.request.headers['User-Agent'] )
        self.render("layouts/%s.layout.html" % (browser_type),**info) # 
        
    def post(self):
        if "stop-server" in self.request.arguments.keys():
            self.application.ioloop.stop()
        self.write('done.')

