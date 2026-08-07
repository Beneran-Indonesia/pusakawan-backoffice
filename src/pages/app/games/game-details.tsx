import { Lock, Trash2, Plus, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@radix-ui/react-tabs";
import { Label } from "@/components/ui/label";
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
  UseFormRegister,
  FieldError,
  Merge,
  FieldErrorsImpl,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { GameDetails } from "@/types/app/app-game-details-type";
import { Game } from "@/types/app/app-games-type";
import { useTranslate } from "@refinedev/core";

type GameDetailsTabProps = {
  control: Control<GameDetails>;
  register: UseFormRegister<GameDetails>;
  errors: Merge<FieldError, FieldErrorsImpl<Game>> | undefined;
  watch: UseFormWatch<GameDetails>;
  setValue: UseFormSetValue<GameDetails>;
};

export default function GameDetailsTab({
  control,
  register,
  errors,
  watch,
  setValue,
}: GameDetailsTabProps) {
  const t = useTranslate();

  const description = watch("game.description") ?? "";
  const banner = watch("game.banner") ?? "";
  const rules = watch("game.rules") ?? [];

  const title = watch("game.title") ?? "";

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

  return (
    <TabsContent value="details" className="mt-6 space-y-6">
      {/* Game Type */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <Label className="block text-sm font-semibold text-slate-700 mb-3">
          {t("app.games.details.game_type.label")}
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
                  {t("app.games.details.game_type.offline.title")}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {t("app.games.details.game_type.offline.description")}
                </div>
              </button>

              <div className="relative rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-center opacity-70 cursor-not-allowed">
                <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                <div className="text-lg font-bold text-slate-400">
                  {t("app.games.details.game_type.online.title")}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {t("app.games.details.game_type.online.description")}
                </div>
              </div>
            </div>
          )}
        />
      </section>

      {/* Game Title */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <Label className="block text-sm font-semibold text-slate-700 mb-3">
          {t("app.games.details.title.label")}
        </Label>
        <Input
          className="px-4"
          {...register("game.title")}
          type="text"
          maxLength={100}
          placeholder={t("app.games.details.title.placeholder")}
        />
        <div className="flex items-center justify-between mt-1">
          {errors && errors.title && (
            <p className="text-xs text-red-600">{errors.title.message}</p>
          )}
          <p className="text-xs text-slate-400 ml-auto">
            {t("app.games.details.title.character_count", {
              count: title.length,
            })}
          </p>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <Label className="block text-sm font-semibold text-slate-700 mb-3">
          {t("app.games.details.banner.label")}
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
            <span className="text-sm font-medium">
              {t("app.games.details.banner.upload_cta")}
            </span>
            <Input
              className="px-4 hidden"
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
            />
          </Label>
        )}
        {errors && errors.banner && (
          <p className="text-xs text-red-600 mt-1">{errors.banner.message}</p>
        )}
      </section>

      {/* About the Game */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <Label className="block text-sm font-semibold text-slate-700 mb-3">
          {t("app.games.details.about.label")}
        </Label>
        <textarea
          {...register("game.description")}
          maxLength={500}
          rows={4}
          placeholder={t("app.games.details.about.placeholder")}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          {errors && errors.description && (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          )}
          <p className="text-xs text-slate-400 ml-auto">
            {t("app.games.details.about.character_count", {
              count: description.length,
            })}
          </p>
        </div>
      </section>

      {/* Game Rules */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <Label className="block text-sm font-semibold text-slate-700 mb-3">
          {t("app.games.details.rules.label")}
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
                  placeholder={t("app.games.details.rules.placeholder", {
                    number: index + 1,
                  })}
                />
                <p className="text-xs text-slate-400 text-right mt-1">
                  {t("app.games.details.rules.character_count", {
                    count: rule.length,
                  })}
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
              {t("app.games.details.rules.add_button")}
            </button>
          )}
        </div>
        {errors && errors.rules && (
          <p className="text-xs text-red-600 mt-2">
            {errors.rules.message as string}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Date Range */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
          <Label className="block text-sm font-semibold text-slate-700 mb-3">
            {t("app.games.details.held_on.label")}
          </Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-slate-500 mb-1.5">
                {t("app.games.details.held_on.start_label")}
              </Label>
              <Input
                className="px-4"
                {...register("game.held_on.start_datetime")}
                type="datetime-local"
              />
            </div>

            <div>
              <Label className="block text-xs text-slate-500 mb-1.5">
                {t("app.games.details.held_on.end_label")}
              </Label>
              <Input
                className="px-4"
                {...register("game.held_on.end_datetime")}
                type="datetime-local"
              />
            </div>
          </div>

          {errors && errors.held_on?.end_datetime && (
            <p className="text-xs text-red-600 mt-2">
              {errors.held_on.end_datetime.message}
            </p>
          )}
        </section>

        {/* Group Size */}
        <section className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6">
          <Label className="block text-sm font-semibold text-slate-700 mb-3">
            {t("app.games.details.group_size.label")}
          </Label>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="block text-xs text-slate-500 mb-1.5">
                {t("app.games.details.group_size.min_label")}
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
                {t("app.games.details.group_size.max_label")}
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

          {errors && errors.group_size?.maximum_participants && (
            <p className="text-xs text-red-600 mt-2">
              {errors.group_size.maximum_participants.message}
            </p>
          )}
        </section>
      </div>

      <div className="block lg:grid grid-cols-2 grid-rows-2 gap-4">
        {/* Diversity Points */}
        <BooleanToggleField
          control={control}
          name="game.diversity_points"
          label={t("app.games.details.diversity_points.label")}
          trueLabel={t("app.games.details.diversity_points.on")}
          falseLabel={t("app.games.details.diversity_points.off")}
        />

        {/* Linear Flow */}
        <BooleanToggleField
          control={control}
          name="game.is_linear_flow"
          label={t("app.games.details.linear_flow.label")}
          trueLabel={t("app.games.details.linear_flow.linear")}
          falseLabel={t("app.games.details.linear_flow.non_linear")}
        />

        {/* Correct Authentication */}
        <BooleanToggleField
          control={control}
          name="game.is_correct_authentication"
          label={t("app.games.details.correct_authentication.label")}
          trueLabel={t("app.games.details.correct_authentication.correct")}
          falseLabel={t("app.games.details.correct_authentication.both")}
        />

        {/* Automation Start */}
        <BooleanToggleField
          control={control}
          name="game.is_automatic_start"
          label={t("app.games.details.automatic_start.label")}
          trueLabel={t("app.games.details.automatic_start.automatic")}
          falseLabel={t("app.games.details.automatic_start.manual")}
        />
      </div>
    </TabsContent>
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
