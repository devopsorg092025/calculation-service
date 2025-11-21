# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy your public folder contents to Nginx's HTML directory
COPY public /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
