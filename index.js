import asyncHandler from "express-async-handler";

// AWS CODE
const createAWSEnvironments = asyncHandler(async (req, res) => {
  console.log("Create AWS Environments");
  res.send("createAWSEnvironments Not yet implmented");
  res.end;
});

const getAWSAccess = asyncHandler(async (req, res) => {
  console.log("Get AWS Access");
  res.send("getAWSAccess Not yet implemented");
  res.end;
});

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

export { getAWSAccess, getAWSCost, getAWSPolicy, createAWSEnvironments };
