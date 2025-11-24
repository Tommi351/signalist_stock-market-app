'use client';

import {useForm} from "react-hook-form";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";

const Login = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    }, );
    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log('Sign In', data);
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1 className="form-title">Log In Into Your Account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    register={register}
                    error={errors.email}
                    validation={{required: 'Email name is required', pattern: /^\w+@\w+$/, message: 'Email address is required'}}
                    />

                 <InputField
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="Enter a strong password"
                     register={register}
                     error={errors.password}
                     validation={{required: 'Password is required', pattern: /^\w+@\w+$/, minLength: 8}}
                     />

                  <button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                      {isSubmitting ? 'Logging In...' : 'Log In'}
                  </button>

                <FooterLink text="Don't have an account?" linkText="Sign Up" href="/sign-up" />
            </form>
        </>
    )
}
export default Login;
