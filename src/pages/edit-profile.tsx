import {
  HttpError,
  useIsAuthenticated,
  useTranslate,
} from "@refinedev/core";
import { Navigate, useNavigate } from "react-router";
import {
  Camera,
  Save,
  ArrowLeft,
  User as UserIcon,
  Calendar,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { LoadingSpinner } from "@/components/Loading";
import { Controller, } from "react-hook-form";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import z from "zod";
import ErrorLabel from "@/components/ErrorLabel";

type Translate = ReturnType<typeof useTranslate>;

const EditProfileSchema = (t: Translate) =>
  z.object({
    email: z
      .string()
      .min(1, t("edit_profile.errors.email.required"))
      .email(t("edit_profile.errors.email.valid")),

    name: z.string().min(1, t("edit_profile.errors.name.required")),

    avatar: z
      .union([
        z.string(), // existing URL
        z.instanceof(File), // new upload
      ])
      .optional(),

    gender: z.enum(["FEMALE", "MALE"]),

    birthdate: z.string().min(1, t("edit_profile.errors.birthdate.required")),

    institution: z
      .string()
      .min(1, t("edit_profile.errors.institution.required")),

    phone: z.string().min(1, t("edit_profile.errors.phone_number.required")),
  });

type EditProfileT = z.infer<ReturnType<typeof EditProfileSchema>>;

export default function EditProfile() {
  const { data: user, isLoading: authLoading } = useIsAuthenticated();
  const t = useTranslate();

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileT, HttpError, EditProfileT>({
    resolver: zodResolver(EditProfileSchema(t)),
    refineCoreProps: {
      action: "edit",
      resource: "profile",
      id: "me",

      successNotification: {
        type: "success",
        message: t("edit_profile.success_notification.message"),
        description: t("edit_profile.success_notification.description"),
      },

      errorNotification: {
        type: "error",
        message: t("edit_profile.error_notification.message"),
        description: t("edit_profile.error_notification.description"),
      },
    },
  });

  const navigate = useNavigate();
  const onBack = () => navigate(-1);
  const avatar = watch("avatar");

  const profileImage =
    avatar instanceof File ? URL.createObjectURL(avatar) : avatar;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("avatar", {
        type: "manual",
        message: t("edit_profile.errors.avatar.only_image"),
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("avatar", {
        type: "manual",
        message: t("edit_profile.errors.avatar.too_large"),
      });
      return;
    }

    clearErrors("avatar");

    setValue("avatar", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submit = handleSubmit(async (values) => {
    await onFinish(values);
  });

  const authenticated = !authLoading && user?.authenticated === true;

  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Auth initialization finished and there's no user.
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider>
      <LoadingOverlay loading={formLoading}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t("edit_profile.header.title")}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    {t("edit_profile.header.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <form onSubmit={submit} className="space-y-6">
              {/* Profile Image Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("edit_profile.profile_photo.title")}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#AE1622] to-[#871826] flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <Label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border-2 border-gray-100">
                      <Camera className="w-5 h-5 text-gray-600" />
                      <Controller
                        control={control}
                        name="avatar"
                        render={() => (
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        )}
                      />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("edit_profile.profile_photo.upload")}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {t("edit_profile.profile_photo.description")}
                    </p>
                    <Label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                      <Camera className="w-4 h-4" />
                      {t("edit_profile.profile_photo.choose_photo")}
                      <Controller
                        control={control}
                        name="avatar"
                        render={() => (
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        )}
                      />
                    </Label>
                  </div>
                  <ErrorLabel errors={errors.avatar} />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("edit_profile.personal_information.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("edit_profile.personal_information.full_name.label")}
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...register("name")}
                        type="text"
                        className="pl-11"
                        title={t(
                          "edit_profile.personal_information.full_name.title",
                        )}
                        placeholder={t(
                          "edit_profile.personal_information.full_name.placeholder",
                        )}
                      />
                    </div>
                    <ErrorLabel errors={errors.name} />
                  </div>

                  {/* Birthdate */}
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("edit_profile.personal_information.birthdate")}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input {...register("birthdate")} type="date" />
                    </div>
                    <ErrorLabel errors={errors.birthdate} />
                  </div>

                  {/* Gender */}
                  <div className="h-full flex flex-col">
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("edit_profile.personal_information.gender.label")}
                    </Label>

                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <>
                            <button
                              type="button"
                              className={`p-2 rounded-xl border-2 transition-all ${
                                field.value === "MALE"
                                  ? "border-red-700 bg-red-50 text-red-700"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              onClick={() => field.onChange("MALE")}
                            >
                              <div className="font-semibold">
                                {t(
                                  "edit_profile.personal_information.gender.male",
                                )}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("FEMALE")}
                              className={`p-2 rounded-xl border-2 transition-all ${
                                field.value === "FEMALE"
                                  ? "border-red-700 bg-red-50 text-red-700"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="font-semibold">
                                {t(
                                  "edit_profile.personal_information.gender.female",
                                )}
                              </div>
                            </button>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/*  */}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("edit_profile.contact_information.title")}
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {/* Email (Locked) */}
                    <div className="w-1/2">
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("edit_profile.contact_information.email.label")}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...register("email")}
                          type="email"
                          disabled
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("edit_profile.contact_information.email.locked")}
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="w-1/2">
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t(
                          "edit_profile.contact_information.phone_number.label",
                        )}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...register("phone")}
                          type="tel"
                          placeholder="+62123456789"
                        />
                      </div>
                      <ErrorLabel errors={errors.phone} />
                    </div>
                  </div>
                  {/* Institution */}
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("edit_profile.contact_information.institution.label")}
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...register("institution")}
                        type="text"
                        placeholder={t(
                          "edit_profile.contact_information.institution.placeholder",
                        )}
                      />
                    </div>
                    <ErrorLabel errors={errors.institution} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("edit_profile.contact_information.buttons.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#AE1622] to-[#871826] hover:from-[#871826] hover:to-[#6d1420] text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting
                    ? t("edit_profile.contact_information.buttons.saving")
                    : t("edit_profile.contact_information.buttons.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </LoadingOverlay>
    </ThemeProvider>
  );
}