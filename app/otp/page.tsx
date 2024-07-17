'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";
import {createCookie, deleteCookie} from '../(lib)/nookies'
import { useRouter } from 'next/navigation';
import { Button, TextField, FormLabel } from '@mui/material';
const schema = z.object({
    otp: z.string()
      .nonempty({ message: "OTP is required" })
      .min(4, { message: "Enter a 4-digit OTP" })
      .max(4, { message: "Enter a 4-digit OTP" })
  });


const verifyOTP = gql`
query verify_OTP($otp: String!, $email: EmailAddress!) {
    verifyOTP(otp: $otp, email: $email) {
      accessToken
      refreshToken
    }
  }
`;

function OTP() {
    const router = useRouter();

      const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
      });
          
      const [verify_OTP, { data, loading, error }] = useLazyQuery(verifyOTP, {
        onCompleted: (data) => {
            if(data.verifyOTP){
                const { accessToken, refreshToken } = data.verifyOTP;
                createCookie(accessToken, refreshToken);
                router.push('/home');
            }
            // router.push('/otp'); // Redirect to dashboard or any other page
          // else {
          //   alert("Login failed. Please check your credentials.");
          // }
        },
        onError: (error) => {
          console.log(error.message);
        }
      });
    
    
  const onSubmit = (formData) => {
    const email = "ahmed.h+admin@hubspire.com"; // Replace with your hard-coded email
    const otp = formData.otp;
    verify_OTP({
      variables: { otp, email } // Ensure keys match the expected parameters in the query
    });

  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/12 bg-white rounded-lg p-7 text-black">
        <h1 className="text-3xl flex justify-center">Validate your Account</h1>
        <p className="text-gray-400 text-xs flex justify-center my-6">We have sent an OTP to your email address</p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel sx={{
          color: 'black',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Email Address</FormLabel>
          <TextField
            type="text"
            variant="standard"
            fullWidth
            margin="none"
            placeholder="OTP"
            error={!!errors.otp}
            helperText={errors.otp ? errors.otp.message : ''}
            {...register("otp")}
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
          <Button type="submit" variant="contained" color="primary" fullWidth
          sx={{
            marginTop:'15px',
            backgroundColor: '#0060D1',
            borderRadius: '10px'}}>
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}


export default OTP;
