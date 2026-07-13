FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY 403.html /usr/share/nginx/html/
COPY about-us.html /usr/share/nginx/html/
COPY cmmc.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8000/ || exit 1
