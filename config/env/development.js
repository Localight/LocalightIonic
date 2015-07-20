'use strict';
module.exports = {
	db: 'mongodb://localws:password@ds059702.mongolab.com:59702/localismdev',
	app: {
		title: 'Localight Web Service - Development Environment'
	},
	twilio:{
		accountSID: process.env.ACCOUNT_SID || 'AC9bfd970cef5934b23e69f1ef72812a23',
                authTOKEN: process.env.AUTH_TOKEN || 'a6bfeeed497cfb9b8d10c329ce721759',
//		accountSID: process.env.ACCOUNT_SID || 'AC3f3d26948bcaffbde196abc45c3e7b89',
//		authTOKEN: process.env.AUTH_TOKEN || 'be441e1b8273e1fe4af1ba78169638b0',
	},
	mailgun: {
					apiKey: 'key-212g0rzf7j9z-n9b7zdl797o3bxrsu38',
					 domain: 'https://api.mailgun.net/v3/rs56424.mailgun.org',
	},
	mailer: {
		from: process.env.MAILER_FROM || 'postmaster@rs56424.mailgun.org',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'mailgun',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'postmaster@rs56424.mailgun.org',
				pass: process.env.MAILER_PASSWORD || '0z53ixs2b6c4'
			}
		}
	},
	stripe: {
              secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_GF61iHn9X33Ip9vNGCnRRZTP',
              publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_XHrjrZeUDNIITwzqrw9OEpQG',
   },
};
