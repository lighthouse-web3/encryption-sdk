// const isIPFS = require("is-ipfs");

// module.exports.isCid = (cid) => isIPFS.cid(hash);

module.exports.isCidReg = (cid) =>
  /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.test(
    cid
  );

module.exports.isEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
