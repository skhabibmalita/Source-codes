import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [focused, setFocused] = useState({ user: false, pass: false });

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-glass">
          <h2 className="login-title">Welcome Back</h2>
          <form className="login-form">
            <div
              className={`login-field ${
                focused.user ? "login-field-focused" : ""
              }`}
            >
              <input
                type="text"
                required
                onFocus={() => setFocused({ ...focused, user: true })}
                onBlur={() => setFocused({ ...focused, user: false })}
                autoComplete="off"
              />
              <span className="login-label">Username</span>
            </div>
            <div
              className={`login-field ${
                focused.pass ? "login-field-focused" : ""
              }`}
            >
              <input
                type="password"
                required
                onFocus={() => setFocused({ ...focused, pass: true })}
                onBlur={() => setFocused({ ...focused, pass: false })}
                autoComplete="off"
              />
              <span className="login-label">Password</span>
            </div>
            <button className="login-btn" type="submit">
              <span>Login</span>
            </button>
          </form>
          <div className="login-links">
            <a href="#">Forgot Password?</a>
            <a href="#">Sign Up</a>
          </div>
        </div>
        <div className="login-circles">
          <div className="circle circle1" />
          <div className="circle circle2" />
          <div className="circle circle3" />
        </div>
      </div>
    </div>
  );
}