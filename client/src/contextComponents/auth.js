import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
const UserContext = createContext({ user: null });
var isUserLoggedIn = null;

if (localStorage.getItem("loggedInToken")) {
  var userTokenDecoded = jwtDecode(localStorage.getItem("loggedInToken"));

  if (userTokenDecoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("loggedInToken");
  } else {
    isUserLoggedIn = userTokenDecoded;
  }
}

function userAuthReducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload
      };
    case "logout":
      return {
        ...state,
        user: null
      };
    default:
      throw new Error();
  }
}
//code taken from here: https://reactjs.org/docs/hooks-reference.html#usereducer
function UserAuthProvider(props) {
  const [state, dispatch] = useReducer(userAuthReducer, {
    user: isUserLoggedIn
  });

  const logout = () => {
    localStorage.removeItem("loggedInToken");
    dispatch({
      type: "logout"
    });
  };

  const login = data => {
    localStorage.setItem("loggedInToken", data.token);

    dispatch({
      type: "login",
      payload: data
    });
  };
  return (
    <UserContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { UserContext, UserAuthProvider };
