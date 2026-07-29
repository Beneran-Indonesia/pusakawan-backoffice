import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Save,
  Eye,
  Lock,
  Trash2,
  Plus,
  ImagePlus,
} from "lucide-react";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { UnderDevelopment } from "@/components/refine-ui/layout/under-development";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GameDetails,
  GameDetailsSchema,
  GameStatus
} from "@/types/app/app-game-details-type";

const tabTriggerClass =
  "flex-1 rounded-lg py-3 text-sm font-semibold text-slate-600 transition-colors " +
  "data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none " +
  "data-[state=inactive]:bg-transparent hover:data-[state=inactive]:bg-slate-50";

export default function AppGamesForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  const notValid = true;

  const {
    refineCore: { onFinish, formLoading },
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GameDetails, HttpError, GameDetails>({
    resolver: zodResolver(GameDetailsSchema),
    defaultValues: {
      game: {
        is_offline: true,
        is_linear_flow: true,
        is_correct_authentication: true,
        is_automatic_start: true,
        diversity_points: true,
      },
    },
  });

  const title = watch("game.title") ?? "";
  const description = watch("game.description") ?? "";
  const banner = watch("game.banner") ?? "";
  const status = watch("status");
  const isOffline = watch("game.is_offline");
  const rules = watch("game.rules") ?? [];

  const updateRule = (index: number, value: string) => {
    const next = [...rules];
    next[index] = value;
    setValue("game.rules", next, { shouldDirty: true, shouldValidate: true });
  };

  const removeRule = (index: number) => {
    setValue(
      "game.rules",
      rules.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const addRule = () => {
    if (rules.length >= 5) return;
    setValue("game.rules", [...rules, ""], { shouldDirty: true });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("game.banner", URL.createObjectURL(file), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onFinishWithStatus = (status: GameStatus) =>
    handleSubmit(async (values) => {
      await onFinish({
        ...values,
        status,
      });
    })();

  return (
    <LoadingOverlay loading={formLoading}>
      <form className="pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-1 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {title || "New Game"}
              </h1>
              <p className="text-slate-500 mt-1">
                {status === "published" ? "Published" : "Draft"} •{" "}
                {isOffline ? "Offline" : "Online"} Game
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 shrink-0 mt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onFinishWithStatus("draft")}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting || notValid}
              onClick={() => onFinishWithStatus("published")}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-auto p-2 bg-white border border-slate-200 rounded-xl gap-1">
            <TabsTrigger value="details" className={tabTriggerClass}>
              Game Details
            </TabsTrigger>
            <TabsTrigger value="questions" className={tabTriggerClass}>
              Questions
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className={tabTriggerClass}>
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* GAME DETAILS TAB */}
          <TabsContent value="details" className="mt-6 space-y-6">
            {/* Game Type */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Type
              </Label>
              <Controller
                control={control}
                name="game.is_offline"
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`rounded-xl border-2 p-6 text-center transition-all ${
                        field.value
                          ? "border-red-600 bg-red-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          field.value ? "text-red-600" : "text-slate-700"
                        }`}
                      >
                        Offline
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        Physical location game
                      </div>
                    </button>

                    <div className="relative rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-center opacity-70 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                      <div className="text-lg font-bold text-slate-400">
                        Online
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Under development
                      </div>
                    </div>
                  </div>
                )}
              />
            </section>

            {/* Game Title */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Title
              </Label>
              <Input
                className="px-4"
                {...register("game.title")}
                type="text"
                maxLength={100}
                placeholder="Enter game title"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.game && errors.game.title && (
                  <p className="text-xs text-red-600">{errors.game.title.message}</p>
                )}
                <p className="text-xs text-slate-400 ml-auto">
                  {title.length}/100 characters
                </p>
              </div>
            </section>

            {/* Banner */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                Banner
              </Label>
              {banner ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={banner}
                    alt="Game banner"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setValue("game.banner", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Label className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-red-400 hover:text-red-500 cursor-pointer transition-colors">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm font-medium">Upload banner</span>
                  <Input
                    className="px-4 hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                </Label>
              )}
              {errors.game && errors.game.banner && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.game.banner.message}
                </p>
              )}
            </section>

            {/* About the Game */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                About the Game
              </Label>
              <textarea
                {...register("game.description")}
                maxLength={500}
                rows={4}
                placeholder="Describe the game..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.game && errors.game.description && (
                  <p className="text-xs text-red-600">
                    {errors.game.description.message}
                  </p>
                )}
                <p className="text-xs text-slate-400 ml-auto">
                  {description.length}/500 characters
                </p>
              </div>
            </section>

            {/* Game Rules */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Rules (Max 5) - Not Required
              </Label>
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <Input
                        className="px-4"
                        type="text"
                        value={rule}
                        maxLength={200}
                        onChange={(e) => updateRule(index, e.target.value)}
                        placeholder={`Rule ${index + 1}`}
                      />
                      <p className="text-xs text-slate-400 text-right mt-1">
                        {rule.length}/200 characters
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {rules.length < 5 && (
                  <button
                    type="button"
                    onClick={addRule}
                    className="flex w-full justify-center items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Rules
                  </button>
                )}
              </div>
              {errors.game && errors.game.rules && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.game.rules.message as string}
                </p>
              )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Date Range */}
              <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
                <Label className="block text-sm font-semibold text-slate-700 mb-3">
                  Held On (Datetime Range)
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs text-slate-500 mb-1.5">
                      Start Date
                    </Label>
                    <Input
                      className="px-4"
                      {...register("game.held_on.start_datetime")}
                      type="datetime-local"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs text-slate-500 mb-1.5">
                      End Date
                    </Label>
                    <Input
                      className="px-4"
                      {...register("game.held_on.end_datetime")}
                      type="datetime-local"
                    />
                  </div>
                </div>

                {errors.game && errors.game.held_on?.end_datetime && (
                  <p className="text-xs text-red-600 mt-2">
                    {errors.game.held_on.end_datetime.message}
                  </p>
                )}
              </section>

              {/* Group Size */}
              <section className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6">
                <Label className="block text-sm font-semibold text-slate-700 mb-3">
                  Group Size (Members per Group)
                </Label>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="block text-xs text-slate-500 mb-1.5">
                      Minimum Members
                    </Label>
                    <Input
                      className="px-4"
                      {...register("game.group_size.minimum_participants", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min={1}
                      max={100}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="block text-xs text-slate-500 mb-1.5">
                      Maximum Members
                    </Label>
                    <Input
                      className="px-4"
                      {...register("game.group_size.maximum_participants", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min={2}
                      max={100}
                    />
                  </div>
                </div>

                {errors.game && errors.game.group_size?.maximum_participants && (
                  <p className="text-xs text-red-600 mt-2">
                    {errors.game.group_size.maximum_participants.message}
                  </p>
                )}
              </section>
            </div>

            <div className="block lg:grid grid-cols-2 grid-rows-2 gap-4">
              {/* Diversity Points */}
              <BooleanToggleField
                control={control}
                name="game.diversity_points"
                label="Diversity Points"
                trueLabel="ON"
                falseLabel="OFF"
              />

              {/* Linear Flow */}
              <BooleanToggleField
                control={control}
                name="game.is_linear_flow"
                label="Linear Flow"
                trueLabel="Linear"
                falseLabel="Non-Linear"
              />

              {/* Correct Authentication */}
              <BooleanToggleField
                control={control}
                name="game.is_correct_authentication"
                label="Correct Authentication"
                trueLabel="Correct"
                falseLabel="Both Authentication"
              />

              {/* Automation Start */}
              <BooleanToggleField
                control={control}
                name="game.is_automatic_start"
                label="Automatic Start"
                trueLabel="Automatic"
                falseLabel="Manual"
              />
            </div>
          </TabsContent>

          {/* QUESTIONS TAB */}
          <TabsContent
            value="questions"
            className="mt-6 bg-white rounded-xl border border-slate-200 min-h-96"
          >
            <UnderDevelopment title="Questions" />
          </TabsContent>

          {/* LEADERBOARD TAB */}
          <TabsContent
            value="leaderboard"
            className="mt-6 bg-white rounded-xl border border-slate-200 min-h-96"
          >
            <UnderDevelopment title="Leaderboard" />
          </TabsContent>
        </Tabs>
      </form>
    </LoadingOverlay>
  );
}

type BooleanToggleFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
};

export function BooleanToggleField<T extends FieldValues>({
  control,
  name,
  label,
  trueLabel = "ON",
  falseLabel = "OFF",
}: BooleanToggleFieldProps<T>) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6">
      <Label className="block text-sm font-semibold text-slate-700 mb-5">
        {label}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => field.onChange(true)}
              className={`w-1/2 py-3 rounded-xl border-2 font-semibold transition-all ${
                field.value
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {trueLabel}
            </button>

            <button
              type="button"
              onClick={() => field.onChange(false)}
              className={`w-1/2 py-3 rounded-xl border-2 font-semibold transition-all ${
                !field.value
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {falseLabel}
            </button>
          </div>
        )}
      />
    </section>
  );
}
