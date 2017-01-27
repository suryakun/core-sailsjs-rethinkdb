var nodemailer = require('nodemailer');

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols

class Email {

    constructor() {
        // create reusable transporter object using SMTP transport
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: sails.config.mail.user,
                pass: sails.config.mail.pass
            }
        });
    }

    send(content, to) {
        var mailOptions = {
            from: 'Company name ✔ <surya.ramshere@gmail.com>', // sender address
            to: to, // list of receivers
            subject: 'Password Reset ✔', // Subject line
            // text: 'Hello world ✔', // plaintext body
            html: '<b>'+ content +' ✔</b>' // html body
        };

        // send mail with defined transport object
        this.transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });    
    }

}

module.exports = new Email();