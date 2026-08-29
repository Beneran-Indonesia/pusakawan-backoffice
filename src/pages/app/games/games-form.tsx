import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useResourceParams, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { UnderDevelopment } from "@/components/refine-ui/layout/under-development";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GameDetails,
  GameDetailsSchema,
} from "@/types/app/app-game-details-type";
import { GameStatus } from "@/types/app/app-games-type";
import GameDetailsTab from "./game-details";
import QuestionsFormTab from "./questions-form";

const tabTriggerClass =
  "flex-1 rounded-lg py-3 text-sm font-semibold text-slate-600 transition-colors " +
  "data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-none " +
  "data-[state=inactive]:bg-transparent hover:data-[state=inactive]:bg-slate-50";

export default function AppGamesForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useResourceParams();

  const t = useTranslate();

  const {
    refineCore: { onFinish, formLoading },
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<GameDetails, HttpError, GameDetails>({
    resolver: zodResolver(GameDetailsSchema(t)),
    // Validates immediately -- on change.
    mode: "onChange",
    refineCoreProps: {
      action: "edit",
      resource: "games",
      id,
    },
    defaultValues: {
      status: "draft",
      questions: [],
      game: {
        status: "draft",
        is_offline: true,
        is_linear_flow: true,
        is_correct_authentication: true,
        is_automatic_start: true,
        diversity_points: true,
      },
    },
  });

  const title = watch("game.title") ?? "";
  const isOffline = watch("game.is_offline");
  const status = watch("status");
  const questions = watch("questions") ?? [];

  // Publishing requires both the game details AND at least one question
  const notValid = !isValid || questions.length === 0;

  const onFinishWithStatus = (status: GameStatus) =>
    handleSubmit(async (values) => {
      await onFinish({
        ...values,
        status,
        game: {
          ...values.game,
          status,
        },
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
                {title || t("app.games.form.untitled")}
              </h1>
              <p className="text-slate-500 mt-1">
                {status === "published"
                  ? t("app.games.form.status.published")
                  : t("app.games.form.status.draft")}
                {" • "}
                {isOffline
                  ? t("app.games.form.type.offline")
                  : t("app.games.form.type.online")}
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
              {t("app.games.form.save_as_draft")}
            </button>
            <button
              type="button"
              disabled={isSubmitting || notValid}
              onClick={() => onFinishWithStatus("published")}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {t("app.games.form.publish")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-auto p-2 bg-white border border-slate-200 rounded-xl gap-1">
            <TabsTrigger value="details" className={tabTriggerClass}>
              {t("app.games.form.tabs.details")}
            </TabsTrigger>
            <TabsTrigger value="questions" className={tabTriggerClass}>
              {t("app.games.form.tabs.questions")}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className={tabTriggerClass}>
              {t("app.games.form.tabs.leaderboard")}
            </TabsTrigger>
          </TabsList>

          {/* GAME DETAILS TAB */}
          <GameDetailsTab
            control={control}
            register={register}
            errors={errors.game}
            watch={watch}
            setValue={setValue}
          />

          {/* QUESTIONS TAB */}
          <QuestionsFormTab
            control={control}
            register={register}
            errors={errors.questions}
            watch={watch}
            setValue={setValue}
            trigger={trigger}
          />

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
