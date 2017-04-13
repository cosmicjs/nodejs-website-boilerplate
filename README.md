# Node.js Website Boilerplate
A website template that satisfies some common website requirements including dynamic pages, blog articles, author management, SEO ability, contact form and website search.  Contributions welcome!
## Demo
[Click here to view a demo website (Medical Professional)](https://cosmicjs.com/apps/medical-professional/demo)
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
Import the `example-bucket.json` file into your Cosmic JS bucket.  To do this go to Your Bucket > Settings > Import / Export Data.

![Import Bucket](https://cosmicjs.com/uploads/4edef890-52e6-11e6-9a1c-233e4e7aa20d-ZadK2PbDDR.gif "Import Bucket")

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
### Config
#### Contact email
Because Node.js doesn't have a mail server, the contact form uses an SMTPS string to connect to your mail server of choice. To do this, add an `SMTPS_STRING` to your ENV vars in your Cosmic JS bucket.  This is located in Your Bucket > Settings > Deploy Website.  An example string looks like: `smtps://yourname%40gmail.com:yourpass@smtp.gmail.com`.
