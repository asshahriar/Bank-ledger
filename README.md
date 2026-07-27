🏦 Backend Ledger API
A backend-only banking ledger system built with Node.js, Express.js, MongoDB, and Mongoose.
This project provides a RESTful API for user authentication, account management, ledger-based balance calculation, fund transfers, system-generated initial funds, JWT authentication, token blacklisting, and email notifications.
The project was built as a learning project to understand real-world backend concepts such as authentication, authorization, database relationships, financial transactions, idempotency, MongoDB transactions, immutable ledger records, and external email services.
---
🚀 Live API
The API is deployed on Render:
https://bank-ledger-0h3m.onrender.com
Health Check
```http
GET /
```
Response:
```text
Ledger Service is up and running
```
> \*\*Note:\*\* This is a backend-only project. You can interact with the API using Postman, Insomnia, Thunder Client, curl, or another REST API client.
---
✨ Features
User registration
User login and logout
JWT-based authentication
Cookie-based authentication
Bearer token authentication
Password hashing with bcrypt
JWT token blacklisting
Automatic blacklist token expiration
User account creation
Multiple accounts per user
Account status management
Ledger-based balance calculation
Fund transfers between accounts
Transaction status management
Idempotency key support
MongoDB transactions
Debit and credit ledger entries
System-user authorization
Initial funds functionality
Registration email notifications
Transaction email notifications
---
🛠️ Tech Stack
Backend
Node.js
Express.js
MongoDB
Mongoose
Authentication & Security
JSON Web Token (JWT)
bcryptjs
Cookie-based authentication
Bearer token authentication
JWT token blacklist
Email
Nodemailer
Gmail OAuth2
Deployment
Render
---
🏗️ Architecture
The application follows a layered backend architecture:
```text
Client / Postman
       │
       ▼
     Routes
       │
       ▼
   Middleware
       │
       ▼
   Controllers
       │
       ├──────────────► Services
       │                   │
       │                   ▼
       │               Nodemailer
       │
       ▼
     Models
       │
       ▼
    MongoDB
```
Routes
Define the available API endpoints.
Middleware
Handles authentication and system-user authorization.
Controllers
Contains the main business logic for authentication, accounts, and transactions.
Models
Defines MongoDB schemas, relationships, validation, indexes, and database behavior.
Services
Contains external service logic such as email delivery.
---
📁 Project Structure
```text
backend-ledger/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blackList.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   │
│   ├── services/
│   │   └── email.service.js
│   │
│   └── app.js
│
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```
---
🔐 Authentication
The application uses JWT authentication.
JWT tokens are created during:
Registration
Login
Tokens expire after:
```text
3 days
```
The token can be sent using either a cookie or an Authorization header.
Cookie
```text
token=<JWT>
```
Authorization Header
```http
Authorization: Bearer <JWT>
```
---
🔑 Authentication Flow
```text
Register / Login
       │
       ▼
Generate JWT
       │
       ├──► Set token cookie
       │
       └──► Return token in response
                    │
                    ▼
              Protected API
                    │
                    ▼
             Auth Middleware
                    │
                    ▼
              Verify JWT
                    │
                    ▼
             Find User
                    │
                    ▼
               Allow Request
```
---
👤 Authentication API
Base URL:
```text
https://bank-ledger-0h3m.onrender.com/api/auth
```
---
1. Register User
Endpoint
```http
POST /api/auth/register
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/auth/register
```
Description
Creates a new user, hashes their password, generates a JWT, and attempts to send a registration email.
Authentication
Not required.
Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Required Fields
Field	Type	Required
`name`	String	Yes
`email`	String	Yes
`password`	String	Yes
Password Requirements
The password must contain at least 6 characters.
Successful Response
Status: `201 Created`
```json
{
  "user": {
    "\_id": "USER\_ID",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "JWT\_TOKEN"
}
```
Existing User
Status: `422 Unprocessable Entity`
```json
{
  "message": "User already exists with email.",
  "status": "failed"
}
```
---
2. Login
Endpoint
```http
POST /api/auth/login
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/auth/login
```
Description
Authenticates an existing user and returns a JWT.
Authentication
Not required.
Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Successful Response
Status: `200 OK`
```json
{
  "user": {
    "\_id": "USER\_ID",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "JWT\_TOKEN"
}
```
Invalid Credentials
Status: `401 Unauthorized`
```json
{
  "message": "Email or password is INVALID"
}
```
---
3. Logout
Endpoint
```http
POST /api/auth/logout
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/auth/logout
```
Description
Logs the user out by adding their JWT to the blacklist and clearing the authentication cookie.
Authentication
The token can be supplied through:
```http
Authorization: Bearer <JWT>
```
or the `token` cookie.
Successful Response
Status: `200 OK`
```json
{
  "message": "User logged out successfully"
}
```
---
🛡️ Token Blacklisting
When a user logs out, their JWT is stored in the token blacklist collection.
```text
User Logout
     │
     ▼
Extract JWT
     │
     ▼
Store JWT in blacklist
     │
     ▼
Clear Cookie
     │
     ▼
Future requests reject JWT
```
Blacklist entries automatically expire after 3 days using a MongoDB TTL index.
This prevents a logged-out token from remaining usable after logout.
---
🏦 Account API
Base URL:
```text
https://bank-ledger-0h3m.onrender.com/api/accounts
```
All account endpoints are protected.
Authentication can be provided with:
```http
Authorization: Bearer <JWT>
```
---
4. Create Account
Endpoint
```http
POST /api/accounts/
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/accounts/
```
Description
Creates a new account for the currently authenticated user.
Authentication
Required.
Request Body
No request body is required.
Example Request
```http
POST /api/accounts/
Authorization: Bearer YOUR\_JWT\_TOKEN
```
Successful Response
Status: `201 Created`
```json
{
  "account": {
    "\_id": "ACCOUNT\_ID",
    "user": "USER\_ID",
    "status": "ACTIVE",
    "currency": "INR"
  }
}
```
---
5. Get User Accounts
Endpoint
```http
GET /api/accounts/
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/accounts/
```
Description
Returns all accounts belonging to the authenticated user.
Authentication
Required.
Successful Response
Status: `200 OK`
```json
{
  "accounts": \[
    {
      "\_id": "ACCOUNT\_ID",
      "user": "USER\_ID",
      "status": "ACTIVE",
      "currency": "INR"
    }
  ]
}
```
---
6. Get Account Balance
Endpoint
```http
GET /api/accounts/balance/:accountId
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/accounts/balance/ACCOUNT\_ID
```
Description
Returns the calculated balance of a specific account.
Authentication
Required.
Example
```http
GET /api/accounts/balance/ACCOUNT\_ID
Authorization: Bearer YOUR\_JWT\_TOKEN
```
Successful Response
Status: `200 OK`
```json
{
  "accountId": "ACCOUNT\_ID",
  "balance": 5000
}
```
Account Not Found
Status: `404 Not Found`
```json
{
  "message": "Account not found"
}
```
---
💰 How Account Balance Works
The balance is not stored directly as a balance field.
Instead, it is calculated from the ledger.
```text
Balance = Total Credits - Total Debits
```
For example:
```text
Credits:
+ $1,000
+ $500

Debits:
- $200
- $100

Balance:
$1,200
```
The ledger acts as the source of truth for account balances.
> \*\*Note:\*\* The account model currently uses `INR` as its default currency. The example above uses `$` only to explain the calculation conceptually.
---
💸 Transaction API
Base URL:
```text
https://bank-ledger-0h3m.onrender.com/api/transactions
```
---
7. Create Transaction
Endpoint
```http
POST /api/transactions/
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/transactions/
```
Description
Transfers funds from one account to another.
Authentication
Required.
Request Body
```json
{
  "fromAccount": "FROM\_ACCOUNT\_ID",
  "toAccount": "TO\_ACCOUNT\_ID",
  "amount": 500,
  "idempotencyKey": "unique-transfer-001"
}
```
Required Fields
Field	Type	Description
`fromAccount`	String	Sender account ID
`toAccount`	String	Receiver account ID
`amount`	Number	Transfer amount
`idempotencyKey`	String	Unique identifier for the transaction
Successful Response
Status: `201 Created`
```json
{
  "message": "Transaction completed successfully",
  "transaction": {
    "\_id": "TRANSACTION\_ID",
    "fromAccount": "FROM\_ACCOUNT\_ID",
    "toAccount": "TO\_ACCOUNT\_ID",
    "amount": 500,
    "status": "COMPLETED",
    "idempotencyKey": "unique-transfer-001"
  }
}
```
---
🔄 Transaction Processing Flow
The transfer system follows a multi-step process:
```text
1. Validate request
        ↓
2. Validate idempotency key
        ↓
3. Validate account existence
        ↓
4. Check account status
        ↓
5. Calculate sender balance
        ↓
6. Check sufficient funds
        ↓
7. Create PENDING transaction
        ↓
8. Create DEBIT ledger entry
        ↓
9. Create CREDIT ledger entry
        ↓
10. Mark transaction COMPLETED
        ↓
11. Commit MongoDB transaction
        ↓
12. Send email notification
```
---
🔁 Idempotency
The transaction API requires a unique:
```text
idempotencyKey
```
This prevents accidental duplicate processing when the same request is submitted more than once.
Example:
```json
{
  "fromAccount": "ACCOUNT\_A",
  "toAccount": "ACCOUNT\_B",
  "amount": 500,
  "idempotencyKey": "transfer-12345"
}
```
If the same idempotency key is submitted again, the API checks the existing transaction instead of creating another transaction.
Completed Transaction
Status: `200 OK`
```json
{
  "message": "Transaction already processed",
  "transaction": {}
}
```
Pending Transaction
```json
{
  "message": "Transaction is still processing"
}
```
Failed Transaction
Status: `500`
```json
{
  "message": "Transaction processing failed, please retry"
}
```
Reversed Transaction
Status: `500`
```json
{
  "message": "Transaction was reversed, please retry"
}
```
---
❌ Transaction Validation
Before processing a transfer, the API checks several conditions.
Account Existence
Both accounts must exist.
```json
{
  "message": "Invalid fromAccount or toAccount"
}
```
Account Status
Both accounts must be:
```text
ACTIVE
```
Possible account statuses:
```text
ACTIVE
FROZEN
CLOSED
```
Sufficient Balance
The sender must have enough balance to complete the transfer.
Example:
```json
{
  "message": "Insufficient balance. Current balance is 1000. Requested amount is 5000"
}
```
---
🏛️ System Initial Funds
Endpoint
```http
POST /api/transactions/system/initial-funds
```
Full URL
```text
https://bank-ledger-0h3m.onrender.com/api/transactions/system/initial-funds
```
Description
Allows a system user to create an initial funds transaction for another account.
This endpoint is protected by the system-user middleware.
Authentication
Required.
The authenticated user must have:
```text
systemUser === true
```
Request Body
```json
{
  "toAccount": "ACCOUNT\_ID",
  "amount": 1000,
  "idempotencyKey": "initial-funds-001"
}
```
Successful Response
Status: `201 Created`
```json
{
  "message": "Initial funds transaction completed successfully",
  "transaction": {
    "\_id": "TRANSACTION\_ID",
    "fromAccount": "SYSTEM\_ACCOUNT\_ID",
    "toAccount": "ACCOUNT\_ID",
    "amount": 1000,
    "status": "COMPLETED",
    "idempotencyKey": "initial-funds-001"
  }
}
```
System User Authorization
A normal authenticated user cannot access this endpoint.
If the authenticated user is not a system user:
Status: `403 Forbidden`
```json
{
  "message": "Forbidden access, not a system user"
}
```
---
📚 Ledger System
The ledger is the foundation of the balance calculation.
Every successful transfer creates ledger entries.
A normal transfer creates:
```text
Sender Account
      │
      ▼
DEBIT $500

Receiver Account
      │
      ▼
CREDIT $500
```
The account balance is derived from these entries:
```text
Balance = Credits - Debits
```
---
🔒 Ledger Immutability
Ledger entries are designed to be immutable.
The ledger model prevents operations such as:
Update
Delete
Replace
Bulk update
Bulk delete
Once a ledger entry is created, it should not be modified.
This helps preserve the historical integrity of financial records.
---
📊 Transaction States
Transactions support four states:
```text
PENDING
COMPLETED
FAILED
REVERSED
```
PENDING
The transaction has started but hasn't finished processing.
COMPLETED
The transfer successfully completed.
FAILED
The transaction failed during processing.
REVERSED
The transaction was reversed.
---
🗄️ Database Models
The project uses the following MongoDB collections.
---
User
Collection:
```text
user
```
Fields:
Field	Type	Description
`\_id`	ObjectId	User ID
`name`	String	User name
`email`	String	Unique email
`password`	String	Hashed password
`systemUser`	Boolean	System-user authorization
`createdAt`	Date	Creation timestamp
`updatedAt`	Date	Update timestamp
Passwords are hashed using bcrypt before being stored.
---
Account
Collection:
```text
account
```
Fields:
Field	Type	Description
`\_id`	ObjectId	Account ID
`user`	ObjectId	Account owner
`status`	String	Account status
`currency`	String	Account currency
`createdAt`	Date	Creation timestamp
`updatedAt`	Date	Update timestamp
Account statuses:
```text
ACTIVE
FROZEN
CLOSED
```
Default currency:
```text
INR
```
---
Transaction
Collection:
```text
transaction
```
Fields:
Field	Type	Description
`\_id`	ObjectId	Transaction ID
`fromAccount`	ObjectId	Sender account
`toAccount`	ObjectId	Receiver account
`amount`	Number	Transfer amount
`status`	String	Transaction state
`idempotencyKey`	String	Unique transaction key
`createdAt`	Date	Creation timestamp
`updatedAt`	Date	Update timestamp
---
Ledger
Collection:
```text
ledger
```
Fields:
Field	Type	Description
`account`	ObjectId	Related account
`amount`	Number	Ledger amount
`transaction`	ObjectId	Related transaction
`type`	String	CREDIT or DEBIT
Ledger types:
```text
CREDIT
DEBIT
```
Ledger records are immutable.
---
Token Blacklist
Collection:
```text
tokenBlackList
```
Fields:
Field	Type	Description
`token`	String	Blacklisted JWT
`createdAt`	Date	Creation timestamp
`updatedAt`	Date	Update timestamp
Blacklist records automatically expire after 3 days using a MongoDB TTL index.
---
🛡️ Security
The project includes several security mechanisms.
Password Hashing
Passwords are hashed using:
```text
bcryptjs
```
with a salt round of `10`.
JWT Authentication
JWT tokens are signed using:
```text
JWT\_SECRET
```
and expire after 3 days.
Token Blacklisting
Logged-out tokens are stored in a blacklist and rejected by authentication middleware.
Protected Routes
Account and transaction routes require authentication.
System Authorization
System-only operations require:
```text
systemUser === true
```
Input Validation
Mongoose schema validation is used for:
Email
Password
Account status
Transaction amount
Transaction type
Required fields
---
📧 Email Notifications
The project uses Nodemailer with Gmail OAuth2.
Emails are used for:
User Registration
```text
Welcome to Backend Ledger!
```
Successful Transaction
```text
Transaction Successful!
```
Failed Transaction
```text
Transaction Failed
```
The email service uses:
```text
SMTP Host: smtp.gmail.com
Port: 587
Protocol: STARTTLS
Authentication: OAuth2
```
> Email delivery depends on the configured Gmail OAuth2 credentials and the deployment environment.
---
🌐 Complete API Route Summary
Method	Endpoint	Authentication	Description
`GET`	`/`	No	API health check
`POST`	`/api/auth/register`	No	Register user
`POST`	`/api/auth/login`	No	Login user
`POST`	`/api/auth/logout`	Token	Logout user
`POST`	`/api/accounts/`	User	Create account
`GET`	`/api/accounts/`	User	Get user's accounts
`GET`	`/api/accounts/balance/:accountId`	User	Get account balance
`POST`	`/api/transactions/`	User	Transfer funds
`POST`	`/api/transactions/system/initial-funds`	System User	Add initial funds
---
🧪 Testing With Postman
You can test the API using:
Postman
Insomnia
Thunder Client
curl
Any REST API client
Step 1 — Register
```http
POST https://bank-ledger-0h3m.onrender.com/api/auth/register
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Save the returned JWT.
---
Step 2 — Login
```http
POST https://bank-ledger-0h3m.onrender.com/api/auth/login
```
Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the returned token.
---
Step 3 — Create Account
```http
POST https://bank-ledger-0h3m.onrender.com/api/accounts/
```
Header:
```http
Authorization: Bearer YOUR\_JWT\_TOKEN
```
No body is required.
Copy the returned account ID.
---
Step 4 — Get Accounts
```http
GET https://bank-ledger-0h3m.onrender.com/api/accounts/
```
Header:
```http
Authorization: Bearer YOUR\_JWT\_TOKEN
```
---
Step 5 — Add Initial Funds
This endpoint requires a system user.
```http
POST https://bank-ledger-0h3m.onrender.com/api/transactions/system/initial-funds
```
Body:
```json
{
  "toAccount": "ACCOUNT\_ID",
  "amount": 1000,
  "idempotencyKey": "initial-funds-001"
}
```
Header:
```http
Authorization: Bearer SYSTEM\_USER\_JWT\_TOKEN
```
---
Step 6 — Check Balance
```http
GET https://bank-ledger-0h3m.onrender.com/api/accounts/balance/ACCOUNT\_ID
```
Header:
```http
Authorization: Bearer YOUR\_JWT\_TOKEN
```
---
Step 7 — Transfer Funds
```http
POST https://bank-ledger-0h3m.onrender.com/api/transactions/
```
Header:
```http
Authorization: Bearer YOUR\_JWT\_TOKEN
```
Body:
```json
{
  "fromAccount": "FROM\_ACCOUNT\_ID",
  "toAccount": "TO\_ACCOUNT\_ID",
  "amount": 250,
  "idempotencyKey": "transfer-001"
}
```
---
🔄 Recommended Testing Flow
If someone wants to test the entire system from scratch, use this order:
```text
1. Register User A
        ↓
2. Login User A
        ↓
3. Create Account A
        ↓
4. Register/Login User B
        ↓
5. Create Account B
        ↓
6. Use System User to add initial funds
        ↓
7. Check Account A balance
        ↓
8. Transfer funds from A → B
        ↓
9. Check Account A balance
        ↓
10. Check Account B balance
```
Example:
```text
System User
     │
     │ $1,000
     ▼
Account A
     │
     │ $250 transfer
     ▼
Account B
```
Result:
```text
Account A = $750
Account B = $250
```
> The account model currently defaults to `INR`; the dollar amounts above are only illustrative examples of the transaction flow.
---
⚙️ Local Installation
1. Clone the Repository
```bash
git clone YOUR\_GITHUB\_REPOSITORY\_URL
```
2. Navigate Into the Project
```bash
cd backend-ledger
```
3. Install Dependencies
```bash
npm install
```
4. Create Environment Variables
Create a file named:
```text
.env
```
Example:
```env
MONGO\_URI=your\_mongodb\_connection\_string
JWT\_SECRET=your\_jwt\_secret

EMAIL\_USER=your\_email
CLIENT\_ID=your\_google\_oauth\_client\_id
CLIENT\_SECRET=your\_google\_oauth\_client\_secret
REFRESH\_TOKEN=your\_google\_oauth\_refresh\_token
```
Never commit your `.env` file to GitHub.
---
▶️ Run the Server
Start the server using the npm script defined in `package.json`.
Example:
```bash
npm start
```
For development:
```bash
npm run dev
```
The application currently listens on:
```text
http://localhost:3000
```
---
🗃️ MongoDB
The application uses MongoDB through Mongoose.
The connection string is provided through:
```env
MONGO\_URI=your\_mongodb\_connection\_string
```
The database connection is initialized when the server starts.
---
🔐 Environment Variables
Variable	Purpose
`MONGO\_URI`	MongoDB connection string
`JWT\_SECRET`	Secret used to sign JWTs
`EMAIL\_USER`	Gmail account used for email
`CLIENT\_ID`	Google OAuth2 client ID
`CLIENT\_SECRET`	Google OAuth2 client secret
`REFRESH\_TOKEN`	Google OAuth2 refresh token
Never expose these values publicly.
---
🚀 Deployment
The API is deployed using Render.
The application can be deployed as a Node.js web service.
Required environment variables should be added through the Render dashboard rather than committed to the repository.
Production URL
```text
https://bank-ledger-0h3m.onrender.com
```
---
🧠 Key Backend Concepts Demonstrated
This project was created as a learning project, but it implements several backend concepts used in production systems.
Authentication
JWT
Cookies
Bearer authentication
Password hashing
Token expiration
Authorization
Protected routes
System-user authorization
Database Design
MongoDB
Mongoose
ObjectId relationships
Indexes
TTL indexes
Financial Data Modeling
Accounts
Transactions
Ledger entries
Credits
Debits
Balance calculation
Transaction Safety
MongoDB sessions
Database transactions
Idempotency keys
Immutable ledger records
External Services
Gmail OAuth2
Nodemailer
Deployment
Render
Environment variables
Production debugging
---
🎯 Learning Outcomes
Building this project helped me understand backend development beyond simple CRUD applications.
Some of the main concepts I learned include:
Designing REST APIs
Building authentication systems
Hashing passwords
Working with JWT
Implementing authorization middleware
Connecting Node.js applications to MongoDB
Designing database relationships
Working with MongoDB transactions
Designing ledger-based financial systems
Implementing idempotency
Handling immutable financial records
Sending transactional emails
Deploying backend applications
Debugging production issues
---
🔮 Future Improvements
Possible future improvements include:
Add refresh tokens
Add email verification
Add password reset
Add rate limiting
Add request validation using Zod or Joi
Add centralized error handling
Add transaction history endpoint
Add account freeze/close functionality
Add pagination
Add transaction reversal functionality
Add comprehensive automated tests
Add Swagger/OpenAPI documentation
Add Docker support
Add CI/CD
Add frontend dashboard
Improve financial precision using integer minor units instead of floating-point numbers
Improve authorization checks to ensure users can only transfer from accounts they own
---
📌 Known Limitations
This project is primarily a learning project and is not intended to process real financial transactions.
It should not be used for actual banking or financial operations without significant additional security, auditing, compliance, testing, monitoring, and infrastructure work.
---
👨‍💻 Author
Shahriar
Full Stack Developer | Aspiring Software Engineer
I built this project while learning backend development and exploring how financial systems can be modeled using APIs, databases, authentication, transactions, and ledgers.
---
⭐ Project Highlights
Some of the concepts I'm particularly proud of implementing:
```text
🔐 JWT Authentication
🔑 Password Hashing
🛡️ Protected Routes
👤 System User Authorization
🏦 Account Management
💰 Ledger-Based Balance Calculation
💸 Fund Transfers
🔄 Idempotency
📚 Immutable Ledger Records
🗃️ MongoDB Transactions
🚫 JWT Token Blacklisting
📧 Transactional Emails
🚀 Render Deployment
```
---
⭐ If you found this project interesting
Feel free to explore the source code, test the API, or connect with me.
Built with Node.js, Express.js, MongoDB, Mongoose, and a lot of learning.