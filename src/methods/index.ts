import { generate } from "./generate"
import { getJWT } from "./getJWT"
import { getAuthMessage } from "./getAuthMessage"
import { recoverKey } from "./recoverKey"
import { recoverShards } from "./recoverShards"
import { saveShards } from "./saveShards"
import { shardKey } from "./shardKey"
import { revokeAccess } from "./revokeAccess"
import { accessControl } from "./accessControl"
import { shareToAddress } from "./shareToAddress"
import { transferOwnership } from "./transferOwnership"
import { getAccessCondition } from "./getAccessCondition"

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