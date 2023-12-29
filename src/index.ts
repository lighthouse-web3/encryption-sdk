import { generate } from "./methods/generate"
import { getJWT } from "./methods/getJWT"
import { getAuthMessage } from "./methods/getAuthMessage"
import { recoverKey } from "./methods/recoverKey"
import { recoverShards } from "./methods/recoverShards"
import { saveShards } from "./methods/saveShards"
import { shardKey } from "./methods/shardKey"
import { revokeAccess } from "./methods/revokeAccess"
import { accessControl } from "./methods/accessControl"
import { shareToAddress } from "./methods/shareToAddress"
import { transferOwnership } from "./methods/transferOwnership"
import { getAccessCondition } from "./methods/getAccessCondition"

export {
  generate,
  getJWT,
  getAuthMessage,
  recoverShards,
  revokeAccess,
  recoverKey,
  saveShards,
  shardKey,
  accessControl,
  shareToAddress,
  transferOwnership,
  getAccessCondition
}

export default {
  generate,
  getJWT,
  getAuthMessage,
  recoverShards,
  revokeAccess,
  recoverKey,
  saveShards,
  shardKey,
  accessControl,
  shareToAddress,
  transferOwnership,
  getAccessCondition
}