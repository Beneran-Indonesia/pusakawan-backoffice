import { Game, GameSchema } from "@/types/app/app-games-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
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

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const DEFAULT_GAME: Game = {
  id: "",
  title: "",
  status: "draft",
  banner: "",
  description: "",
  rules: [],
  held_on: { start_date: "", end_date: "" },
  time_range: { start_time: "09:00", end_time: "17:00" },
  group_size: { minimum_participants: 1, maximum_participants: 2 },
  diversity_points: false,
  is_offline: true,
  is_linear_flow: true,
  is_correct_authentication: true,
  is_automatic_start: true,
};

const tabTriggerClass =
  "flex-1 rounded-lg py-3 text-sm font-semibold text-slate-600 transition-colors " +
  "data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none " +
  "data-[state=inactive]:bg-transparent hover:data-[state=inactive]:bg-slate-50";

export default function AppGamesForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  const {
    refineCore: { onFinish, formLoading },
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Game, HttpError, Game>({
    resolver: zodResolver(GameSchema),
    defaultValues: DEFAULT_GAME,
  });

  const title = watch("title") ?? "";
  const description = watch("description") ?? "";
  const banner = watch("banner");
  const status = watch("status");
  const isOffline = watch("is_offline");
  const rules = watch("rules") ?? [];

  const updateRule = (index: number, value: string) => {
    const next = [...rules];
    next[index] = value;
    setValue("rules", next, { shouldDirty: true, shouldValidate: true });
  };

  const removeRule = (index: number) => {
    setValue(
      "rules",
      rules.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const addRule = () => {
    if (rules.length >= 5) return;
    setValue("rules", [...rules, ""], { shouldDirty: true });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("banner", URL.createObjectURL(file), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSaveDraft = handleSubmit(async (values) => {
    await onFinish({ ...values, status: "draft" });
  });

  const onPublish = handleSubmit(async (values) => {
    await onFinish({ ...values, status: "published" });
  });

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
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {title || "New Game"}
              </h1>
              <p className="text-slate-500 mt-1">
                {status === "published" ? "Published" : "Draft"} •{" "}
                {isOffline ? "Offline" : "Online"} Game
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSaveDraft}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onPublish}
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
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Type
              </label>
              <Controller
                control={control}
                name="is_offline"
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
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Title
              </label>
              <input
                {...register("title")}
                type="text"
                maxLength={100}
                placeholder="Enter game title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
                <p className="text-xs text-slate-400 ml-auto">
                  {title.length}/100 characters
                </p>
              </div>
            </section>

            {/* Banner */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Banner
              </label>
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
                      setValue("banner", "", {
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
                <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-red-400 hover:text-red-500 cursor-pointer transition-colors">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm font-medium">Upload banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                </label>
              )}
              {errors.banner && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.banner.message}
                </p>
              )}
            </section>

            {/* About the Game */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                About the Game
              </label>
              <textarea
                {...register("description")}
                maxLength={500}
                rows={4}
                placeholder="Describe the game..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description && (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-slate-400 ml-auto">
                  {description.length}/500 characters
                </p>
              </div>
            </section>

            {/* Game Rules */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Game Rules (Max 5)
              </label>
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule}
                        maxLength={200}
                        onChange={(e) => updateRule(index, e.target.value)}
                        placeholder={`Rule ${index + 1}`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
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
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                )}
              </div>
              {errors.rules && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.rules.message as string}
                </p>
              )}
            </section>

            {/* Held On (Date Range) */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Held On (Date Range)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Start Date
                  </label>
                  <input
                    {...register("held_on.start_date")}
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    End Date
                  </label>
                  <input
                    {...register("held_on.end_date")}
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              {errors.held_on?.end_date && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.held_on.end_date.message}
                </p>
              )}
            </section>

            {/* Time Range */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Time Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Start Time
                  </label>
                  <select
                    {...register("time_range.start_time")}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    End Time
                  </label>
                  <select
                    {...register("time_range.end_time")}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.time_range?.end_time && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.time_range.end_time.message}
                </p>
              )}
            </section>

            {/* Diversity Points */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Diversity Points
              </label>
              <Controller
                control={control}
                name="diversity_points"
                render={({ field }) => (
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`w-56 py-3 rounded-xl border-2 font-semibold transition-all ${
                        field.value
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      ON
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={`w-56 py-3 rounded-xl border-2 font-semibold transition-all ${
                        !field.value
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      OFF
                    </button>
                  </div>
                )}
              />
            </section>

            {/* Group Size */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Group Size (Members per Group)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Minimum Members
                  </label>
                  <input
                    {...register("group_size.minimum_participants", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={1}
                    max={100}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Maximum Members
                  </label>
                  <input
                    {...register("group_size.maximum_participants", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={2}
                    max={100}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              {errors.group_size?.maximum_participants && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.group_size.maximum_participants.message}
                </p>
              )}
            </section>
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
