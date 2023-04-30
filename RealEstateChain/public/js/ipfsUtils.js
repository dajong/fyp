/* eslint-disable */
import '@babel/polyfill';

const IPFSGateways = {
  InfuraGateway: "https://ipfs.io/ipfs/",
  YourDedicatedGateway: "https://ipfs.io/ipfs/"
};

const projectId = "2OxtMfiBYI2AApoq94qCWMp7DUh";
const projectSecret = "96d1a6ca1f2aaa80d91e1e228c9db32c";

function ReplacePublicGatewayWithYourGateway(jsonOrUrl) {
  return jsonOrUrl.replaceAll(
    IPFSGateways.InfuraGateway,
    IPFSGateways.YourDedicatedGateway
  );
}

function isIpfsData(toBeDetermined) {
  if (toBeDetermined.Hash) {
    return true;
  }
  return false;
}

async function callIpfsCommand(args, data) {
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
    "base64"
  )}`;
  const formData = new FormData();
  if (data.name) {
    formData.append("file", data, data.name);
  } else {
    formData.append("file", data);
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: auth
    },
    mode: "cors",
    body: formData
  };

  const res = await fetch(
    `https://ipfs.infura.io:5001/api/v0/${args}`,
    options
  );
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(err);
  }

  if (isIpfsData(json)) {
    return json;
  }
  if (json.Message) {
    throw new Error(json.Message);
  } else {
    throw new Error(`error parsing result ${text}`);
  }
}
async function uploadToIPFS(data) {
  const result = await callIpfsCommand("add", data);
  const url = IPFSGateways.YourDedicatedGateway + result.Hash;
  return url;
}

async function downloadFromIPFS(ipfsUri) {
  ipfsUri = ReplacePublicGatewayWithYourGateway(ipfsUri);
  const res = await fetch(ipfsUri);
  let receivedObject;
  let text;
  try {
    text = await res.text();
    const textButWithYourGateway = ReplacePublicGatewayWithYourGateway(text);
    receivedObject = JSON.parse(textButWithYourGateway);
  } catch (err) {
    throw new Error(
      `could not parse json, got text instead: ${JSON.stringify(
        err
      )} parsed text:${text}  `
    );
  }
  return receivedObject;
}

module.exports = {
  IPFSGateways,
  ReplacePublicGatewayWithYourGateway,
  downloadFromIPFS,
  uploadToIPFS
};
