import Copyright from "@/components/Copyright";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLogin, useTranslate } from "@refinedev/core";
import { Mail, ShieldCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const Login: React.FC = () => {
  const t = useTranslate();
  const { mutate: login } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    
  });

  const handleSignIn = handleSubmit(({ email, password, rememberMe }) => {
    login({ email, password, rememberMe });
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl grid lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden lg:max-h-[95vh] my-4 lg:my-0">
        <div className="hidden lg:flex lg:col-span-3 relative bg-linear-to-br from-[#AE1622] to-[#871826] p-8 flex-col justify-between">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <img
                src="/pusakawan_white.svg"
                alt="Pusakawan Logo"
                className="h-10 mb-8"
              />

              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  {t("sign_in.title")}
                </h1>
                <p className="text-lg text-white/90 max-w-md">
                  {t("sign_in.tagline")}
                </p>
              </div>
            </div>

            <div className="mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("sign_in.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center">
          <div className="lg:hidden mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 bg-linear-to-br from-[#AE1622] to-[#871826] p-5 md:p-8">
            <img
              src="/pusakawan_white.svg"
              alt="Pusakawan Logo"
              className="h-7 mb-3"
            />
            <h1 className="text-xl font-bold text-white mb-1.5">
              {t("sign_in.title")}
            </h1>
            <p className="text-white/90 text-xs mb-3">{t("sign_in.tagline")}</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-white/90 text-xs leading-relaxed">
                {t("sign_in.description")}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#AE1622]/10 rounded-full mb-3">
              <ShieldCheck className="w-4 h-4 text-[#AE1622]" />
              <span className="text-xs md:text-sm font-semibold text-[#AE1622]">
                {t("sign_in.secure_access")}
              </span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">
              {t("sign_in.signin_title")}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              {t("sign_in.signin_tagline")}
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-gray-700"
                htmlFor="email"
              >
                {t("sign_in.email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("sign_in.email_hint")}
                      aria-invalid={Boolean(errors.email)}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-gray-700"
                htmlFor="password"
              >
                {t("sign_in.password")}
              </Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <InputPassword
                    aria-invalid={Boolean(errors.password)}
                    placeholder={t("sign_in.password_hint")}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked === "indeterminate" ? false : checked,
                        )
                      }
                    />
                  )}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  {t("sign_in.remember_me")}
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full",
                "bg-linear-to-r from-[#AE1622] to-[#871826]",
                "hover:from-[#871826] hover:to-[#6d1420]",
                "text-white font-semibold py-4 rounded-xl",
                "transition-all shadow-lg hover:shadow-xl",
                "transform hover:-translate-y-0.5 active:translate-y-0",
              )}
            >
              {t("sign_in.button")}
            </Button>
          </form>

          {/* <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              {t("sign_in.demo_credentials")}
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>
                <span className="font-medium">Super Admin:</span> admin / admin
              </p>
              <p>
                <span className="font-medium">Teacher:</span> teacher / teacher
              </p>
            </div>
          </div> */}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Copyright className="mb-4 md:mb-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
