"use client";

import Image from "next/image";
import React from "react";

import { toast } from "sonner"

import { Button } from "../ui/button";

const SocialAuthForm = () => {
    const googleButtonClass = "bg-blue-400 body-medium text-light-200 min-h-12 flex-1 rounded-2 px-4 py-3.5 cursor-pointer border-none";
    const githubButtonClass = "bg-black-400 body-medium text-light-200 min-h-12 flex-1 rounded-2 px-4 py-3.5 cursor-pointer";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
        const res = await fetch("/api/auth/sign-in/social", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ provider }),
        });

        const data = await res.json();

        if (data?.url) {
            window.location.href = data.url;
        }
    } catch (error) {
      console.log(error);

      toast("Sign-in Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in.",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={githubButtonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/assets/icons/github.svg"
          alt="GitHub icon"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with GitHub</span>
      </Button>

      <Button className={googleButtonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/assets/icons/google.svg"
          alt="Google icon"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
