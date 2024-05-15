var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const { GridFSBucket } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const dotenv = require("dotenv")



const PasswordReset = require("./models/password.js");
const CompanyData = require("./models/compny.js");
const CustomerData = require("./models/customer.js");
const ProjectData = require("./models/project.js"); 
const POData = require("./models/po.js"); 
const Invoice= require("./models/invoice.js");
const Quotation = require("./models/quotation.js")
const CloseModel = require("./models/close.js");



const app = express()
dotenv.config();

const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.67zykdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"));

// User schema
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

var User = mongoose.model("User", userSchema);

// Login schema
var loginSchema = new mongoose.Schema({
    email: String,
    password: String,
    loginTime: { type: Date, default: Date.now }
});

var Login = mongoose.model("Login", loginSchema);

//company data
// Edit company route
// Update the server-side route to use the correct keys to access the data

// Update company route
app.put("/companyData/:id", async (req, res) => {
    const customerId = req.params.id; // Renamed to a more descriptive name
    const { customerAddress, branchAddress, customerID, 
        customerName, stateCode, GST, dateValidity, ARNNo } = req.body;

    try {
        // Find the company by ID
        const company = await Company.findById(customerId);

        if (!company) {
            return res.status(404).send("Company not found");
        }

        // Update company data
        company.customerAddress = customerAddress;
        company.branchAddress = branchAddress;
        company.customerID = customerID;
        company.customerName = customerName;
        company.stateCode = stateCode;
        company.GST = GST;
        company.dateValidity = dateValidity;
        company.ARNNo = ARNNo;

        // Save the updated company data
        await company.save();

        // Respond with a success message or appropriate response
        return res.status(200).send("Company updated successfully");
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).send("Internal Server Error");
    }
});

  
  // Delete company data by ID
//   app.delete('/companyData/:id', (req, res) => {
//     const companyId = req.params.id;
//     Company.findByIdAndDelete(companyId)
//       .then(() => res.sendStatus(204))
//       .catch(err => {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//       });
//   });
  
  // Update company data by ID
//   app.put('/companyData/:id', (req, res) => {
//     const companyId = req.params.id;
//     const updatedData = req.body; // New data sent from frontend
//     // Use Mongoose to update the document with companyId
//     Company.findByIdAndUpdate(companyId, updatedData, { new: true })
//       .then(updatedDocument => res.json(updatedDocument))
//       .catch(err => {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//       });
//   });








// Signup route
app.post("/sign_up", async (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    try {
        var newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        await newUser.save();
        console.log("User registered successfully.");

        // Save login details
        var newLogin = new Login({
            email: email
        });

        await newLogin.save();
        console.log("Login details saved successfully.");

        // Send success message to the browser
        return res.redirect('dashboard.html?msg=registered');
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send("Error in saving user or login details.");
    }
});

// Login route
app.post("/login", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
        const user = await User.findOne({ email: email, password: password }).exec();
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }
        console.log("User logged in successfully.");

        // Save login details
        var newLogin = new Login({
            email: email
        });

        await newLogin.save();
        console.log("Login details saved successfully.");

        return res.redirect('dashboard.html');
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route to serve the reset password page
app.get('/resetpassword', (req, res) => {
  // Serve your HTML reset password page here
  res.sendFile(__dirname + '/public/resetpassword.html'); // Adjust the path according to your project structure
});

app.post('/resetpassword', async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    // Find the user by email
    const user = await Password.findOne({ email });

    // Check if OTP is valid and not expired
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).send('Invalid or expired OTP');
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP and its expiry fields
    user.otp = undefined;
    user.otpExpiry = undefined;

    // Save user changes
    await user.save();

    // Send success response
    res.send('Password reset successful!');
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).send('Error resetting password');
  }
});

// Route to send OTP via email
app.po// Route to send OTP via email
app.post('/sendotp', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP expiry time (e.g., 5 minutes from now)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP and its expiry time to the database
    await Password.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true }
    );

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.send('OTP sent successfully!');
  } catch (error) {
    console.error('Sending OTP error:', error);
    res.status(500).send('Error sending OTP');
  }
});

// Route to verify OTP
app.post('/verifyotp', async (req, res) => {
  try {
    const { otp } = req.body;

    // Find the OTP entry in the database
    const otpEntry = await Password.findOne({ otp });

    // If no OTP entry found or OTP expired
    if (!otpEntry || otpEntry.otpExpiry < Date.now()) {
      return res.status(400).send('Invalid or expired OTP');
    }

    res.send('OTP verified successfully!');
  } catch (error) {
    console.error('Verifying OTP error:', error);
    res.status(500).send('Error verifying OTP');
  }
});

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  // Configure email transporter (nodemailer)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ranjithamallesh14@gmail.com', // Replace with your email
      pass: 'qxfr shdx pdac feso'
    }
  });

  // Compose email message
  const mailOptions = {
    from: 'ranjithamallesh14@gmail.com', // Replace with your email
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}


//companydata route
app.post("/companyData", async (req, res) => {
    try {
        const companyData = new CompanyData(req.body); // Assuming your Mongoose model is named Company
        await companyData.save();
        
        return res.redirect('customerdata.html');
    } catch (err) {
        console.error("Error saving company data:", err);
        return res.status(500).send("Internal Server Error");
    }
});

// Endpoint to retrieve all company data
app.get('/companyData', async (req, res) => {
    try {
        const companyData = await CompanyData.find();
        res.json(companyData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to update company data
app.put('/companyData/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await CompanyData.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Company data updated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete
// app.delete('/companyData/:id', (req, res) => {
//     const companyId = req.params.id;
//     // Use MongoDB driver or Mongoose to delete the document with companyId
//     // Example using Mongoose:
//     CompanyModel.findByIdAndDelete(companyId, (err, deletedDocument) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.json({ message: 'Company data deleted successfully' });
//     });
// });





// CustomerData route
app.post("/customerData", async (req, res) => {
    try {
        const customerData = new CustomerData(req.body);
        await customerData.save();

        
        return res.redirect('projectdata.html');
    } catch (err) {
        console.error("Error saving customer data:", err);
        res.status(500).send("Internal Server Error");
    }
});



// Customer data route
app.get("/customerData", async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customerData = await CustomerData.findOne({ customerId }); 
        if (!customerData) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.status(200).json(customerData);
    } catch (error) {
        console.error("Error fetching customer data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


//  project data Route
app.post("/projectData", async (req, res) => {
    try {
        const projectData = new ProjectData(req.body);
        await projectData.save();
       
        return res.redirect('quotation.html');

    } catch (err) {
        console.error("Error saving project data:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Define storage for multer(PO)
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage: storage,
});

//  po Route to handle form submission including file upload
app.post("/poData", upload.single('imageUpload'), async (req, res) => {
    try {
        // Access form data
        const { poNumber, poDate, poHSNCode } = req.body;

        // Access the uploaded file
        const uploadedFile = req.file;

        // Create a new POData document and save it to MongoDB
        const poData = new POData({
            poNumber,
            poDate,
            poHSNCode,
            imageUpload: {
                filename: uploadedFile.originalname,
                data: uploadedFile.buffer,
                contentType: uploadedFile.mimetype
            }
        });

        await poData.save();

        
        return res.redirect('invoice.html');
    } catch (error) {
        console.error("Error saving PO data:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Route to serve the file
app.get('/poData/:id', async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).send('File not found');
      }
      res.set('Content-Type', document.imageUpload.contentType);
      res.send(document.imageUpload.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


//endpoint and form submission of quotation data
app.post("/api/quotation", (req, res) => {
    const newQuotation = new Quotation(req.body);
    newQuotation.save((err, savedQuotation) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving quotation');
      } else {
        console.log('Quotation saved:', savedQuotation);
        
        return res.redirect('/po.html');
      }
    });
  });
  
  
 // Endpoint to receive invoice datas
 app.post("/submit/Invoice", (req, res) => {
    const InvoiceData = req.body; // Assuming form data is sent as JSON
    // Create a new Invoice document and save it to the database
    Invoice.create(InvoiceData)
      .then(invoice => {
        console.log('Invoice saved successfully:', invoice);
        return res.redirect('/payments.html');
      })
      .catch(error => {
        console.error('Error saving invoice:', error);
        res.status(500).json({ error: 'An error occurred while saving the invoice' });
      });
  });

// Endpoint to fetch invoice data by multiple customer IDs
app.get("/submit/Invoice/InvoiceByCustomerIds", (req, res) => {
    const customerIds = req.body.customerIds;
  
    // Retrieve invoices with the specified customer IDs from the database
    Invoice.find({ CustomerID: { $in: customerIds } })
      .then(invoices => {
        // Send the retrieved invoices as a response
        res.json(invoices);
      })
      .catch(error => {
        console.error('Error fetching invoices by customer IDs:', error);
        res.status(500).json({ error: 'An error occurred while fetching invoices by customer IDs' });
      });
  });
  
  
  //closure data form submission
  app.post("/closureForm", async (req, res) => {
    try {
      const closeData = new CloseModel(req.body);
      await closeData.save();
      return res.redirect("dashboard.html");
    } catch (err) {
      console.error("Error saving Comments:", err);
      res.status(500).send("Internal Server Error");
    }
  });




app.get("/",(req,res)=>{

    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(port);

console.log("Listening on PORT 3000");
