import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/design-system/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "./lib/storage/domain";
import { getUserService } from "./services/user-service";

export const AuthModalForm = ({
  open,
  setOpen,
  onSuccess,
  onError,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  onError: (err: string) => void;
}) => {
  const [form, setForm] = useState<"sign-in" | "sign-up">("sign-up");

  const handleSuccess = useCallback(async () => {
    onSuccess();
  }, [onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form === "sign-in" ? "Log in!" : "Sign up!"}
          </DialogTitle>
          <DialogDescription>
            To access this feature, you need a (free) account. Create one now,
            or sign in to your existing account!
          </DialogDescription>
        </DialogHeader>
        {form === "sign-up" ? (
          <SignUpForm onSuccess={handleSuccess} onError={onError} />
        ) : (
          <SignInForm onSuccess={handleSuccess} onError={onError} />
        )}
        <p className="text-sm text-muted-foreground">
          {form === "sign-up" ? (
            <>
              Already have an account?{" "}
              <span
                className="cursor-pointer underline"
                onClick={() => setForm("sign-in")}
              >
                Sign in!
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="cursor-pointer underline"
                onClick={() => setForm("sign-up")}
              >
                Sign up!
              </span>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};

const signUpSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .max(25, { message: "Username cannot be more than 25 characters long." }),
  email: z.string().email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long." })
    .max(15, { message: "Password cannot be more than 15 characters long." }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUpForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: (user: User) => void;
  onError: (err: string) => void;
}) => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {},
  });

  const submit = async (data: SignUpSchema) => {
    const response = await getUserService().register(data);

    if (response.data) {
      onSuccess(response.data);
    } else {
      onError("Error when trying to register user: invalid input");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="the_great_narrator" {...field} />
              </FormControl>
              <FormDescription>Your public username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="narrator@the-great.com" {...field} />
              </FormControl>
              <FormDescription>
                Your email address. This is kept private.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Your secure password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Sign up</Button>
      </form>
    </Form>
  );
};

const signInSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, { message: "Username or email is mandatory." }),
  password: z.string().min(1, { message: "Password is mandatory." }),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignInForm = ({
  onSuccess,
  onError,
}: {
  onSuccess: (user: User) => void;
  onError: (err: string) => void;
}) => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {},
  });

  const submit = async (body: SignInSchema) => {
    const response = await getUserService().login(
      body.usernameOrEmail,
      body.password,
    );

    if (response.data) {
      onSuccess(response.data);
    } else {
      onError("Error when trying to login: invalid input");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or email</FormLabel>
              <FormControl>
                <Input placeholder="the_great_narrator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Sign in</Button>
      </form>
    </Form>
  );
};
