import { logout } from "./user.slice";
import { userApi } from "../services/user.service";
import { baseApi } from "../services/baseApi.service";

export const logoutUser = () => (dispatch) => {
  dispatch(logout()); // clear user state + localStorage

  // Reset RTK Query caches
  dispatch(userApi.util.resetApiState());
  dispatch(baseApi.util.resetApiState());
};
