import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const router = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser, isLoading: userCheckInProgress } = useUserContext();
  const { mutateAsync: loginFn, status: loginStatus } = useSignInAccount();
  const formHandler = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isWorking = loginStatus === "pending" || userCheckInProgress;

  const processLogin = async (credentials: z.infer<typeof SigninValidation>) => {
    const loginSession = await loginFn(credentials);
    if (!loginSession) {
      toast({ title: "Login failed. Please try again." });
      return;
    }

    const verified = await checkAuthUser();
    if (!verified) {
      toast({ title: "Login failed. Please try again." });
      return;
    }

    formHandler.reset();
    router("/");
  };

  return (
    <Form {...formHandler}>
      <div className="sm:w-420 flex flex-col items-center justify-center">
        <img src="/assets/images/logo.svg" alt="FlickChat Logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Access Your Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Enter your credentials below to continue.
        </p>

        <form
          onSubmit={formHandler.handleSubmit(processLogin)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          <FormField
            control={formHandler.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formHandler.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isWorking}
          >
            {isWorking ? (
              <div className="flex-center gap-2">
                <Loader /> Logging in...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don’t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;