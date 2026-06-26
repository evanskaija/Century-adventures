from http.server import HTTPServer, BaseHTTPRequestHandler
import base64
import urllib.parse
import os

class UploadHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        parsed_url = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed_url.query)
        filename = params.get('name', ['image.png'])[0]
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        if ',' in post_data:
            post_data = post_data.split(',')[1]
            
        img_data = base64.b64decode(post_data)
        
        dest_dir = r"c:\Users\EVANS\OneDrive\Desktop\my projects\centuary\assets"
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
            
        filepath = os.path.join(dest_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(img_data)
            
        print(f"Successfully saved {filename} to {filepath}")
        self.wfile.write(b'{"status": "success"}')

def run(server_class=HTTPServer, handler_class=UploadHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
