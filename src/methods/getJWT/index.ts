import api from "../../axios";

export const getJWT = async (address: string, payload: string, useAsRefreshToken = false) => {
  try {
    const data = !useAsRefreshToken ? await api
      .post(
        `/api/message/get-jwt`,
        { address, signature: payload },
      )
      .then((res) => res.data) : await api
        .put(
          `/api/message/get-jwt`,
          { address, refreshToken: payload },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data);
    return { JWT: data.token, refreshToken: data.refreshToken, error: null };
  } catch (err) {
    return { JWT: null, error: "Invalid Signature" };
  }
};
