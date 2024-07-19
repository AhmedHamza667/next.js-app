"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";
import { createCookie } from "../../(lib)/nookies";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, Link } from "@mui/material";
import { useSearchParams } from "next/navigation";
import {verifyOTP, resendOTPQuery} from "@/app/(queries)/queries";
const schema = z.object({
  otp: z
    .string()
    .nonempty({ message: "OTP is required" })
    .min(4, { message: "Enter a 4-digit OTP" })
    .max(4, { message: "Enter a 4-digit OTP" }),
});


let currentOTPIndex: number = 0;
function OTP() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const resendToken = searchParams.get("resendOtpToken");

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [timer, setTimer] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
  };
  function maskEmail(email) {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 3) + "***";
    return `${maskedName}@${domain}`;
  }

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    const newOTP = [...otp];
    for (let i = 0; i < 4; i++) {
      newOTP[i] = pasteData[i] || "";
    }
    setOtp(newOTP);
    setActiveOTPIndex(4);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [verify_OTP, { data, loading, error }] = useLazyQuery(verifyOTP, {
    onCompleted: (data) => {
      if (data.verifyOTP) {
        const { accessToken, refreshToken } = data.verifyOTP;
        createCookie(accessToken, refreshToken);
        router.push("/jobs");
      }
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const [
    resend_OTP,
    { data: resendData, loading: resendLoading, error: resendError },
  ] = useLazyQuery(resendOTPQuery);

  const handleResendOTP = () => {
    const resendOtpToken = resendToken;
    resend_OTP({ variables: { resendOtpToken } });

    // Start the timer and disable the button
    setIsButtonDisabled(true);
    setTimer(30);
  };

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsButtonDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isButtonDisabled, timer]);

  useEffect(() => {
    setValue("otp", otp.join(""));
  }, [otp, setValue]);

  const onSubmit = (formData) => {
    const otpValue = otp.join("");
    verify_OTP({
      variables: { otp: otpValue, email },
    });
  };
  const maskedEmail = maskEmail(email);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/12 bg-white rounded-lg p-7 text-black">
        <h1 className="text-3xl flex justify-center">Validate your Account</h1>
        <p className="text-gray-400 text-xs flex justify-center mt-6">
          We have sent an OTP to your email address{" "}
        </p>
        <p className="text-gray-400 text-xs flex justify-center my-2">
          {maskedEmail}
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" justifyContent="space-between" mb={4}>
            {otp.map((_, index) => (
              <React.Fragment key={index}>
                <input
                  ref={activeOTPIndex === index ? inputRef : null}
                  type="text"
                  className={
                    "w-16 h-12 outline-none text-center text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-700 transition border-b-2"
                  }
                  onChange={handleOnChange}
                  onKeyDown={(e) => handleOnKeyDown(e, index)}
                  value={otp[index]}
                  maxLength={1}
                  onPaste={handleOnPaste}
                />
                {index === otp.length - 1 ? null : (
                  <span className={" bg-gray-400"} />
                )}
              </React.Fragment>
            ))}
          </Box>
          {errors.otp && (
            <Typography variant="body2" color="error">
              {errors.otp.message}
            </Typography>
          )}
          <Link
            className="flex justify-center"
            href="#"
            variant="body2"
            color="textSecondary"
            my={2}
            onClick={!isButtonDisabled ? handleResendOTP : null}
            style={{
              pointerEvents: isButtonDisabled ? "none" : "auto",
              opacity: isButtonDisabled ? 0.5 : 1,
            }}
          >
            {isButtonDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#0060D1", borderRadius: "10px" }}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}

export default OTP;
