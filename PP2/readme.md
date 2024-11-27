By Victor, William, Abdullah

Scriptorium is an innovative online platform where you can write, execute, and share code in multiple programming languages. Inspired by the ancient concept of a scriptorium, a place where manuscripts were crafted and preserved, Scriptorium modernizes this idea for the digital age. It offers a secure environment for geeks, nerds, and coding enthusiasts to experiment, refine, and save their work as reusable templates. Whether you’re testing a quick snippet or building a reusable code example, Scriptorium is what you need to bring your ideas to life.
This is the backend portion of the project.

There are three types of users in the application. The first type is Visitor which uses no authentication. User and Admin roles require authentication and user accounts to be created for each.

Visitors to the blog site have no auth and are able to access requests including the endpoints in /api/execute, fork a template, and browse/read blogs.

User level users can save templates, create, delete, and edit blog posts, and provide comments/rate content.
Admin level permissions allow users to sort by reports and review reported inappropriate content.


The application is deployed to a Digital Ocean droplet. It utilizes Docker to conduct virtualization and isolation. On the server, NGINX is used as a server manager. We use PM2 for process management. The site is deployed on the server to localhost:3000 and is NGINX redirects output.

The site has a Let's Encrypt SSL which automatically updates so that SSL is maintained. The site is deployed to https://codeshare.ca/. 
