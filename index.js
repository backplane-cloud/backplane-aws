import asyncHandler from "express-async-handler";
import AWS from "aws-sdk";

async function createAWSAccount(
  accessKeyId,
  secretAccessKey,
  accountName,
  emailAddress
) {
  try {
    // Set up AWS credentials
    const credentials = new AWS.Credentials({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    // Set a default region in the global AWS configuration
    AWS.config.update({ region: "us-east-1" });

    // Set up AWS service objects
    const organizations = new AWS.Organizations({
      credentials: credentials,
    });

    // Create AWS account
    const createAccountParams = {
      AccountName: accountName,
      Email: emailAddress,
      // RoleName: "OrganizationAccountAccessRole", // Optional: specify a custom IAM role for the account
    };
    const createAccountResponse = await organizations
      .createAccount(createAccountParams)
      .promise();
    console.log("AWS account created successfully:", createAccountResponse);
    return createAccountResponse.CreateAccountStatus.AccountName;
  } catch (err) {
    console.error("Error creating AWS account:", err);
    throw err;
  }
}

async function createAWSEnv({
  environs,
  orgCode,
  appCode,
  accessKeyId,
  secretAccessKey,
  emailAddress,
}) {
  try {
    let environments = [];

    await Promise.all(
      environs.map(async (env) => {
        let accountName = `bp-${orgCode.split("-")[0]}-${
          appCode.split("-")[0]
        }-${env}`;
        const accountId = await createAWSAccount(
          accessKeyId,
          secretAccessKey,
          accountName,
          emailAddress
        );

        environments.push(accountId);
      })
    );
    // console.log("environments", environments);
    return environments;
    // res.status(200).json(environments);
  } catch (error) {
    console.error("Error creating AWS environments:", error);
    // res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAWSAccess({ accessKeyId, secretAccessKey, environments }) {
  // Create IAM service object
  const iam = new AWS.IAM();
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region: "eu-west-2",
  });
  let accessAssignments = [];

  try {
    await Promise.all(
      environments.map(async (env) => {
        // Get IAM user details
        const { Users } = await iam.listUsers().promise();
        // const users = Users; //Users.filter((user) => user.Arn.includes(env));

        // Extract access details from the user(s)
        // const accessDetails = users.map((user) => {
        //   return {
        //     UserName: user.UserName,
        //     UserId: user.UserId,
        //     AccessKeys: user.AccessKeys,
        //   };
        // });
        accessAssignments.push({
          environment: env,
          assignments: Users,
        });
      })
    );
  } catch (error) {
    console.error("Error retrieving AWS access for environment:", error);
    // Push a placeholder object to maintain the structure of the results array
    accessAssignments.push({ environment: env, assignments: console.error });
  }

  return accessAssignments;
}

// const getAWSAccess = asyncHandler(async (req, res) => {
//   console.log("Get AWS Access");
//   res.send("getAWSAccess Not yet implemented");
//   res.end;
// });

const getAWSCost = asyncHandler(async (req, res) => {
  console.log("Get AWS Cost");
  res.send("getAWSCost Not yet implemented");
  res.end;
});

const getAWSPolicy = asyncHandler(async (req, res) => {
  console.log("Get AWS Policy");
  res.send("getAWSCost Not yet implemented");
  res.end;
});

export { getAWSAccess, getAWSCost, getAWSPolicy, createAWSEnv };
