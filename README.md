# ZapWallet-Backend

__NOTE :__ To make the transaction happen, the PayTm must have the total amount of all users in their bank account.

<img src="./assets/Pic-1.png" />

### When a transaction happens :

<img src="./assets/Pic-2.png" />

When a transaction happens amount should be detected from one user's account and at the same time the another user's account i.e who is receiving the amount should be added

### Transactions in databases : 

 - A lot of times, you want multiple databases transactions to be atomic
 - Either all of them should update, or none should
 - This is super important in the case of a bank


Can you guess what’s wrong with the following code - 
```javascript
const mongoose = require('mongoose');
const Account = require('./path-to-your-account-model');

const transferFunds = async (fromAccountId, toAccountId, amount) => {
    // Decrement the balance of the fromAccount
	  await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } });

    // Increment the balance of the toAccount
    await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } });
}

// Example usage
transferFunds('fromAccountID', 'toAccountID', 100);
```

1) What if the database crashes right after the first request (only the balance is decreased for one user, and not for the second user)

2) What if the Node.js crashes after the first update?

### Answer

1) It would lead to a database inconsistency. Amount would get debited from the first user, and not credited into the other users account.

2) If a failure ever happens, the first txn should rollback.

3) This is what is called a transaction in a database. We need to implement a transaction on the next set of endpoints that allow users to transfer INR

<!-- _______________________________________________________________________________________ -->

## Routing Structure

### The index.js file in the root folder will have the following :
```javascript
const rootRouter = require("./routes/index.js");

app.use("/api/v1", rootRouter);
```
### router/index.js which exports "rootRouter" will have 2 routing middlewares :

### 1) user router :
```javascript
router.use("/user", userRouter);
```
 - /api/v1/user/signup
 - /api/v1/user/signin
 - /api/v1/user/changePassword

### 2) account router :
 ```javascript
router.use("/account", accountRouter);
```
 - /api/v1/account/trnaferMoney
 - /api/v1/account/balance