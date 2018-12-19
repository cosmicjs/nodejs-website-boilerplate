# Node.js Website Boilerplate
A  website template that satisfies some common website requirements including dynamic pages, blog articles, author management, SEO ability, contact form and website search.  Content powered by [Cosmic JS](https://cosmicjs.com).  Contributions welcome!
## Demo
[Click here to view a demo website (Medical Professional)](https://cosmicjs.com/apps/medical-professional)
## Features
1. Fully responsive down to mobile w/ [Bootstrap](http://getbootstrap.com) frontend<br />
2. SEO ready<br />
3. A contact form that sends an email to your email(s) of choice and to [Cosmic JS](https://cosmicjs.com) for easy reference<br />
4. Full-site search functionality<br />
5. All content is easily managed in [Cosmic JS](https://cosmicjs.com) including pages, blog and contact info.

Sign up for [Cosmic JS](https://cosmicjs.com) to install the demo content and deploy this website.

## Get started
```
git clone https://github.com/cosmicjs/nodejs-website-boilerplate
cd nodejs-website-boilerplate
npm install
```
Import the `bucket.json` file into your Cosmic JS Bucket.  To do this go to Your Bucket > Settings > Import / Export Data.

<img src="https://cosmic-s3.imgix.net/44f0d590-0303-11e9-b4bb-b3fa3d766bf7-sendgrid.gif?w=1300" width="700" />

### Run in production
```
COSMIC_BUCKET=your-bucket-slug npm start
```
Go to [http://localhost:3000](http://localhost:3000).
### Run in development
Create a `config/development.js` file and match it to `config/production.js` with your values.
```
npm run development
```
Go to [http://localhost:5000](http://localhost:5000).

## Contact form setup
Install and deploy the SendGrid Email Function.

<img src="https://cosmic-s3.imgix.net/a07738c0-00d6-11e9-95fe-59d8fdd00c64-sendgrid-email.png?w=1500" width="700" />

The contact form on the contact page uses the [SendGrid Email Function](https://github.com/cosmicjs/send-email-function) to send emails. To deploy your email function go to Your Bucket > Settings > Functions. Install and deploy the SendGrid Function. You will need an account with [SendGrid](https://sendgrid.com/) to add your SendGrid API key.

### Add the SendGrid Function Endpoint

#### in development
Go to `config/development.js` and edit `SENDGRID_FUNCTION_ENDPOINT` to manually add the URL for testing.

#### in production
If you are using the Web Hosting option that's included with every Bucket:
1. Go to Your Bucket > Settings > Web Hosting
2. Deploy your Website
3. Click 'Set Environment Variables' tab and add the SendGrid Function endpoint:

Key | Value
--- | ---
| SENDGRID_FUNCTION_ENDPOINT     | https://your-lambda-endpoint.amazonaws.com/dev/send-email
