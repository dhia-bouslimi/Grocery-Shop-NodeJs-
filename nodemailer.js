var nodemailer = require ('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: {

        user: 'dhiabouslimi80@gmail.com',
        pass: 'lhotjywupqlfzmjw'
    },
});



module.exports.sendConfirmationEmail =(firstName, email, activationCode) => {
    transporter.sendMail ({
        from: 'dhiabouslimi80@gmail.com',
        to: email,
        subject: "Please confirm your account !",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${firstName}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:2500/users/${activationCode}> Click here!!</a>
        </div>`,
       
    })
    .catch((err) => console.log(err));
};

module.exports.sendresetPassword =(firstName,token,email) => {
    transporter.sendMail ({
        from: 'dhiabouslimi80@gmail.com',
        to: email,
        subject: "Password reset!",
        html: `<h1>reset your password</h1>
        <h2>Hello ${firstName}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:2500/users/${token}> Click here!!</a>
        </div>`,
       
    })
    .catch((err) => console.log(err));
};



