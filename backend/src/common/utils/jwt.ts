import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import { SessionDocument } from "../../database/models/session.model";
import { UserDocument } from "../../database/models/user.model";
import { config } from "../../config/app.config";

/* ======================
   Payload Types
====================== */

export type AccessTPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type RefreshTPayload = {
  sessionId: SessionDocument["_id"];
};

/* ======================
   Types
====================== */

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

/* ======================
   Defaults
====================== */

// ✅ For jwt.sign()
const signDefaults: SignOptions = {
  audience: ["user"], // string[] allowed here
};

// ✅ For jwt.verify()
const verifyDefaults: VerifyOptions = {
  audience: "user", // MUST be string / RegExp / tuple
};

/* ======================
   Token Options
====================== */

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN as SignOptions["expiresIn"],
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  secret: config.JWT.REFRESH_SECRET,
};

/* ======================
   Sign JWT
====================== */

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options: SignOptsAndSecret = accessTokenSignOptions
) => {
  const { secret, ...opts } = options;

  return jwt.sign(payload, secret, {
    ...signDefaults,
    ...opts,
  });
};

/* ======================
   Verify JWT
====================== */

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret?: string }
): { payload?: TPayload; error?: string } => {
  try {
    const { secret = config.JWT.SECRET, ...opts } = options || {};

    const decoded = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...opts,
    }) as unknown as TPayload;

    return { payload: decoded };
  } catch (err: any) {
    return { error: err.message };
  }
};
