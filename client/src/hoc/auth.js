/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

export default function (ComposedClass, reload, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      // To know user's current status, send Auth request
      dispatch(auth()).then(async (response) => {
        if (await !response.payload.isAuth) {
          //Not Loggined in Status
          if (reload) {
            props.history.push("/register_login");
          }
        }
        //Loggined in Status
        else {
          //supposed to be Admin page, but not admin person wants to go inside
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          }
          //Logged in Status, but Try to go into log in page
          else {
            if (reload === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, [dispatch, props.history, user.googleAuth]);

    return <ComposedClass {...props} user={user} />;
  }
  return AuthenticationCheck;
}
