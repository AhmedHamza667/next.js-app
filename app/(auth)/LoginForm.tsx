'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from 'next/navigation';
import { Button, TextField } from "@mui/material";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" })
});

const LOGIN_BY_EMAIL = gql`
query LoginByEmail($input: LoginByEmail!) {
  loginByEmail(input: $input) {
    message
  }
}
`;

function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  const router = useRouter();

  const [loginByEmail, { data, loading, error }] = useLazyQuery(LOGIN_BY_EMAIL, {
    onCompleted: (data) => {
        router.push('/otp'); // Redirect to dashboard or any other page
      // else {
      //   alert("Login failed. Please check your credentials.");
      // }
    },
    onError: (error) => {
      console.log(error.message);
    }
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = (formData) => {
    loginByEmail({
      variables: { input: formData }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-4/12 bg-white rounded-lg p-10 text-black">
        <h1 className="text-3xl flex justify-center">Welcome</h1>
        <p className="text-gray-400 text-xs flex justify-center">Please log in to your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
            label="Email Address"
            type="email"
            placeholder="example@company.com"
            fullWidth
            margin="normal"
            variant="standard"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            {...register("email")}
          />
          <div className="relative">
            <TextField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              fullWidth
              margin="normal"
              variant="standard"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2/4 right-0"
            >
              {passwordVisible ? (
                <ion-icon name="eye-outline" size="large"></ion-icon>
              ) : (
                <ion-icon name="eye-off-outline" size="large"></ion-icon>
              )}
            </button>
          </div>
          <br />
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700 flex justify-center">Forgot Password?</a>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>        
          </form>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 text-xs">{error.message}</p>}
        {data && <p>{data.loginByEmail.message}</p>}
      </div>
    </div>
  );
}

export default LoginForm;
