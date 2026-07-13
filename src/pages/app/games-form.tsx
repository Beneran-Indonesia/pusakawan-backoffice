import QuestionsForm from "./questions-form";
import {
  GameDetails,
  GameDetailsSchema,
} from "@/types/app/app-game-details-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useTranslate } from "@refinedev/core";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

type TabKey = "details" | "questions" | "leaderboard";

export default function AppGamesForm() {
  // 1. URL /app/games/create = new
  // URL /app/games/edit/:id

  // if pathname includes "edit", get the id.

  // once we got the ID, useOne to get all of the form values.

  // form:
  const {
    control,
    // handleSubmit, errors, isSubmitting: not wired up yet — this file is
    // still a WIP stub for the Game Details / submit flow (Yuri's part is
    // the Questions tab only, wired in below).
  } = useForm<GameDetails>({
    resolver: zodResolver(GameDetailsSchema),
    defaultValues: {
      questions: [],
    },
    // defaultValues,
  });

  const t = useTranslate();
  const back = useBack();

  const gameTitle = useWatch({ control, name: "game.title" });
  const gameStatus = useWatch({ control, name: "game.status" });
  const isOffline = useWatch({ control, name: "game.is_offline" });
  const questionsCount = useWatch({ control, name: "questions" })?.length ?? 0;

  // Yuri: TEMPORARY tab wiring + header so the Questions tab (and the rest
  // of this page) can be tested end-to-end while the Game Details /
  // Leaderboard tabs are still WIP. Remove/replace this block once those
  // tabs — and the actual Save as Draft / Publish submit handlers — are
  // implemented for real.
  //
  // NOTE: the header block below (back button, title, Save as Draft /
  // Publish) is intentionally kept inline here rather than split into a
  // separate component file, to avoid import-path headaches. If/when this
  // gets reused for a Leaderboard page later, it's a straightforward copy
  // (or extract it into its own file at that point, whichever's easier).
  const [activeTab, setActiveTab] = useState<TabKey>("questions");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "details", label: t("app.games.form.tabs.details") },
    {
      key: "questions",
      label: `${t("app.games.form.tabs.questions")} (${questionsCount})`,
    },
    { key: "leaderboard", label: t("app.games.form.tabs.leaderboard") },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 px-8 py-5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={back}
            aria-label={t("app.games.form.back")}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-800 truncate">
              {gameTitle || t("app.games.form.untitled")}
            </h1>
            <p className="text-sm text-slate-500">
              {gameStatus === "published"
                ? t("app.games.form.status.published")
                : t("app.games.form.status.draft")}
              {" • "}
              {isOffline === false
                ? t("app.games.form.type.online")
                : t("app.games.form.type.offline")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {t("app.games.form.save_as_draft")}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            {t("app.games.form.publish")}
          </button>
        </div>
      </div>

      {/* Tabs + tab content */}
      <div className="flex-1 px-8 py-6 space-y-6">
        <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 font-semibold text-sm transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-red-700 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
            {t("under_development")}
          </div>
        )}

        {activeTab === "questions" && <QuestionsForm control={control} />}

        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
            {t("under_development")}
          </div>
        )}
      </div>
    </div>
  );
}
