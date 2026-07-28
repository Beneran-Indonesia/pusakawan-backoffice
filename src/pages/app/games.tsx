import { CreateButton } from "@/components/refine-ui/buttons/create";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { formatDate } from "@/lib/utils";
import { APP_GAMES_NEW_ROUTE } from "@/lib/urls";
import { Game } from "@/types/app/app-games-type";
import { useCreate, useDelete, useList, useTranslate, useUpdate } from "@refinedev/core";
import { Calendar, Plus, Search, Trophy } from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "online" | "offline";
type FilterStatus = "all" | "published" | "draft";

export default function AppGames() {
  const t = useTranslate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const {
    result: { data: games },
  } = useList<Game>({
    resource: "app-games",
  });

  const { mutate } = useUpdate({
    resource: "app-games",
  });

  const onCreateGame = () => null;

  const onToggleStatus = ({ id, status }: Game) => {
    console.log("tertekan")
    mutate({
      id,
      values: {
        status: status === "draft" ? "published" : "draft",
      },
    });
  };

  // Filter games based on selected filters
  const filteredGames = games.filter((g) => {
    const matchesStatus = filterStatus === "all" || g.status === filterStatus;

    const matchesType =
      filterType === "all" || g.is_offline === (filterType === "offline");

    const matchesSearch =
      searchTerm === "" ||
      g.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const renderGameCard = (game: Game) => (
    <div
      key={game.id}
      // onClick={() => onSelectGame(game)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div className="relative h-48 bg-linear-to-br from-red-500 to-red-700 overflow-hidden">
        {game.banner ? (
          <img
            src={game.banner}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              game.status === "published"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {game.status === "published" ? "Active" : "Draft"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              game.is_offline
                ? "bg-blue-500 text-white"
                : "bg-slate-400 text-white"
            }`}
          >
            {game.is_offline ? "Offline" : "Online"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-slate-800 line-clamp-1">
          {game.title}
        </h3>

        {game.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {game.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {game.held_on && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(game.held_on.start_date)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(game);
            }}
            className={`px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
              game.status === "published"
                ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {game.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ListView>
      <ListViewHeader />
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t("app.games.search_bar.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-w-40"
        >
          <option value="all">
            {t("app.games.search_bar.status_dropdown.all")}
          </option>
          <option value="published">
            {t("app.games.search_bar.status_dropdown.published")}
          </option>
          <option value="draft">
            {t("app.games.search_bar.status_dropdown.draft")}
          </option>
        </select>

        {/* Type Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-w-40"
        >
          <option value="all">
            {t("app.games.search_bar.type_dropdown.all")}
          </option>
          <option value="online">
            {t("app.games.search_bar.type_dropdown.online")}
          </option>
          <option value="offline">
            {t("app.games.search_bar.type_dropdown.offline")}
          </option>
        </select>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {filterStatus === "all" && `${filteredGames.length} Games`}
            {filterStatus === "published" &&
              `${filteredGames.length} Active Games`}
            {filterStatus === "draft" && `${filteredGames.length} Draft Games`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(renderGameCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {games.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {t("app.games.empty_state.title")}
          </h3>
          <p className="text-slate-600 mb-6">
            {t("app.games.empty_state.subtitle")}
          </p>
          <CreateButton>
            <Plus className="w-5 h-5" />
            {t("app.games.create_button")}
          </CreateButton>
        </div>
      )}

      {/* Empty Filter State */}
      {games.length > 0 && filteredGames.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {t("app.games.empty_filter.title")}
          </h3>
          <p className="text-slate-600">
            {filterStatus === "published" && "No published games available"}
            {filterStatus === "draft" && "No draft games available"}
          </p>
        </div>
      )}
    </ListView>
  );
}
