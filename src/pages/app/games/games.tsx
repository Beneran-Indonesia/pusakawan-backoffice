import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { formatDate, getInitials } from "@/lib/utils";
import { Game } from "@/types/app/app-games-type";
import {
  useCreate,
  useDelete,
  useList,
useNavigation,
  useTranslate,
  useUpdate,
} from "@refinedev/core";
import {
  AlertTriangle,
  Calendar,
  Copy,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "online" | "offline";
type FilterStatus = "all" | "published" | "draft";

export default function AppGames() {
  
  const t = useTranslate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  const {
    result: { data: games },
  } = useList<Game>({
    resource: "app-games",
  });

  const { mutate } = useUpdate({
    resource: "app-games",
  });

  const { mutate: createGame } = useCreate();
  const { mutate: deleteGame } = useDelete();

  const { edit } = useNavigation();

  const onToggleStatus = ({ id, status }: Game) => {
    mutate({
      id,
      values: {
        status: status === "draft" ? "published" : "draft",
      },
      meta: { simple: true },
    });
  };

  const onDuplicate = (game: Game) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...rest } = game;
    createGame({
      resource: "app-games",
      values: {
        ...rest,
        status: "draft",
      },
    });
  };

  const confirmDelete = () => {
    if (!gameToDelete) return;
    deleteGame({ resource: "app-games", id: gameToDelete.id! });
    setGameToDelete(null);
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

  const renderGameCard = (gameDetails: Game) => (
    <div
      key={gameDetails.id}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-48 bg-linear-to-br from-red-500 to-red-700 overflow-hidden">
        {gameDetails.banner ? (
          <img
            src={gameDetails.banner}
            alt={gameDetails.title}
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
              gameDetails.status === "published"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {gameDetails.status === "published" ? "Active" : "Draft"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              gameDetails.is_offline
                ? "bg-blue-500 text-white"
                : "bg-slate-400 text-white"
            }`}
          >
            {gameDetails.is_offline ? "Offline" : "Online"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-slate-800 line-clamp-2">
          {gameDetails.title}
        </h3>

        {gameDetails.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-3">
            {gameDetails.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-8 h-8 bg-red-100 shrink-0">
            <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
              {getInitials(gameDetails.author)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {gameDetails.author}
          </span>

          {gameDetails.held_on && (
            <>
              <span className="text-sm text-slate-400">•</span>
              <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(gameDetails.held_on.start_datetime)}</span>
                {" - "}
                <span>{formatDate(gameDetails.held_on.end_datetime)}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-nowrap items-center justify-end gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              edit("app-games", gameDetails.id);
            }}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <Pencil className="w-4 h-4" />
            {t("app.games.card.edit")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(gameDetails);
            }}
            title={t("app.games.card.duplicate")}
            className="shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(gameDetails);
            }}
            className={`min-w-0 flex-1 truncate ${
              gameDetails.status === "published"
                ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-700"
                : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-700"
            }`}
          >
            <span className="truncate">
              {gameDetails.status === "published"
                ? t("app.games.card.unpublish")
                : t("app.games.card.publish")}
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setGameToDelete(gameDetails);
            }}
            className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
            title={t("app.games.card.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
              {filterStatus === "draft" &&
                `${filteredGames.length} Draft Games`}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!gameToDelete}
        onOpenChange={(open) => !open && setGameToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <AlertDialogTitle>
                {t("app.games.delete_modal.title")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {t("app.games.delete_modal.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {gameToDelete && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">
                {t("app.games.delete_modal.item_label")}
              </p>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">
                {gameToDelete.title}
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">
                {t("app.games.delete_modal.warning_label")}
              </span>{" "}
              {t("app.games.delete_modal.warning")}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("app.games.delete_modal.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("app.games.delete_modal.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
