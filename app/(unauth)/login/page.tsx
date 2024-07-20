'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from 'next/navigation';
import { Button, FormLabel, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LOGIN_BY_EMAIL } from "@/app/(queries)/queries";
const schema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" })
});



function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(schema)
  });
  const router = useRouter();

  const [loginByEmail, { data, loading, error }] = useLazyQuery(LOGIN_BY_EMAIL, {
    onCompleted: (data) => {
      if (data.loginByEmail) {
        const { resendOTPToken } = data.loginByEmail;
        const email = getValues("email");
        router.push(`/otp?email=${encodeURIComponent(email)}&resendOtpToken=${encodeURIComponent(resendOTPToken)}`);
      }
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
      <div className="w-4/12 bg-white rounded-lg p-7 text-black">
        <h1 className="text-3xl flex justify-center">Welcome</h1>
        <p className="text-gray-400 text-xs flex justify-center my-3">Please log in to your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel sx={{
          color: 'black',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Email Address</FormLabel>
        <TextField
            type="email"
            placeholder="example@company.com"
            fullWidth
            margin="none"
            variant="standard"            
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            {...register("email")}
            InputProps={{
              disableUnderline: true
            }}
            sx={{
              borderBottom: '1px solid #dcdee0',
              ":hover":{
                border: 'none'
              },              
            }}
          />
          <div className="relative">
          <FormLabel sx={{
          color: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          Password</FormLabel>

            <TextField
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              fullWidth
              margin="none"
              variant="standard"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              {...register("password")}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                borderBottom: '1px solid #dcdee0',
                ":hover":{
                  border: 'none'
                },              
              }}
            />
          </div>
          <br />
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700 flex justify-center">Forgot Password?</a>
          <Button type="submit" variant="contained"  fullWidth sx={{
            marginTop:'15px',
            backgroundColor: '#0060D1',
            borderRadius: '10px'}}>
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
