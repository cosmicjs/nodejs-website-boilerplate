#Node.js Website Boilerplate
The Node.js Website Boilerplate is a website template that satisfies some basic use cases like dynamic pages, blog and contact form.
##Demo
[View a demo website here](http://medical-professional.cosmicapp.co)
##Features
1. Fully responsive down to mobile w/ Bootstrap<br />
2. SEO ready<br />
3. A contact form that sends an email to your email(s) of choice and to [Cosmic JS](https://cosmicjs.com) for easy reference<br />
4. Full-site search functionality<br />
5. All content is easily managed in [Cosmic JS](https://cosmicjs.com) including pages, blog and contact info.

Sign up for [Cosmic JS](https://cosmicjs.com) to install the demo content and deploy this website.

###Get started
```
npm install
```
Import the `bucket.json` file into your Cosmic JS bucket.  Then run:
```
COSMIC_BUCKET=your-bucket-slug npm start
```
####Contact email
Because Node.js doesn't have a mail server, the contact form uses a SMTPS string to connect to your mail server of choice. To do this, add an `SMTPS_STRING` to your ENV vars in your Cosmic JS bucket.  This is located in Your Bucket > Settings > Deploy Website.  An example string looks like: `smtps://yourname%40gmail.com:yourpass@smtp.gmail.com`.
Go to [http://localhost:3000](http://localhost:3000) in your browser of choice.
###Run in development
```
npm run development
```
Go to [http://localhost:5000](http://localhost:5000) in your browser of choice.