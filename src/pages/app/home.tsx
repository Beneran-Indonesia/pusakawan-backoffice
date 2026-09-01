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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Post } from "@/types/app/app-home-type";
import {
  useDelete,
  useList,
  useNavigation,
  useTranslate,
  useTranslation,
  useUpdate,
} from "@refinedev/core";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getInitials, getRelativeTime } from "@/lib/utils";

type FilterStatus = "all" | "published" | "draft";

function PostImageCarousel({
  pictures,
  alt,
}: {
  pictures: string[];
  alt: string;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () =>
      setCurrent(carouselApi.selectedScrollSnap()),
    );
  }, [carouselApi]);

  if (pictures.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <ImageOff className="w-10 h-10 text-slate-300" />
      </div>
    );
  }

  return (
    <Carousel
      setApi={setCarouselApi}
      opts={{ loop: pictures.length > 1 }}
      className="w-full h-full group"
    >
      <CarouselContent className="ml-0 h-full">
        {pictures.map((picture, index) => (
          <CarouselItem key={`${picture}-${index}`} className="pl-0 h-full">
            <img
              src={picture}
              alt={`${alt} ${index + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {pictures.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              carouselApi?.scrollPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              carouselApi?.scrollNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {pictures.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === current ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
}

export default function AppHome() {
  const t = useTranslate();
  const { getLocale } = useTranslation();
  const locale = getLocale();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const {
    result: { data: posts },
    query: { isLoading },
  } = useList<Post>({ resource: "app-home" });

  const { mutate: updatePost } = useUpdate();
  const { mutate: deletePost } = useDelete();

  const { edit } = useNavigation();

  const onToggleStatus = ({ id, status }: Post) => {
    updatePost({
      resource: "app-home",
      id,
      values: { status: status === "draft" ? "published" : "draft" },
    });
  };

  const confirmDelete = () => {
    if (!postToDelete) return;
    deletePost({ resource: "app-home", id: postToDelete.id! });
    setPostToDelete(null);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderPostCard = (post: Post) => (
    <div
      key={post.id}
      className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-64 bg-slate-100">
        <PostImageCarousel pictures={post.pictures} alt={post.description} />
        <span
          className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-semibold pointer-events-none ${
            post.status === "published"
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {post.status === "published"
            ? t("app.home.filter.published")
            : t("app.home.filter.draft")}
        </span>
      </div>

      <div className="p-5 grow flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-8 h-8 bg-red-100">
            {post.author.avatar && <AvatarImage src={post.author.avatar} alt={post.author.name} />}
            <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
              {getInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-800">
            {post.author.name}
          </span>
          <span className="text-sm text-slate-400">•</span>
          <span className="text-sm text-slate-500">
            {getRelativeTime(post.published_at ?? post.created_at, locale)}
          </span>
        </div>

        <p className="text-sm text-slate-700 mb-4 line-clamp-5">
          {post.description}
        </p>

        <div className="flex flex-nowrap items-center justify-end gap-2 mt-auto">
          <Button
            onClick={() => edit("app-home", post.id!)}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <Pencil className="w-4 h-4" />
            {t("app.home.card.edit")}
          </Button>
          <Button
            variant="outline"
            onClick={() => onToggleStatus(post)}
            className={`min-w-0 flex-1 truncate ${
              post.status === "published"
                ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-700"
                : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-700"
            }`}
          >
            <span className="truncate">
              {post.status === "published"
                ? t("app.home.card.unpublish")
                : t("app.home.card.publish")}
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPostToDelete(post)}
            className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
            title={t("app.home.card.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <LoadingOverlay loading={isLoading}>
      <ListView>
        <ListViewHeader />

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("app.home.filter.title")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-w-40"
          >
            <option value="all">{t("app.home.filter.all")}</option>
            <option value="published">{t("app.home.filter.published")}</option>
            <option value="draft">{t("app.home.filter.draft")}</option>
          </select>
        </div>

        {/* Content Grid */}
        {filteredPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {filteredPosts.length} {t("app.home.contents")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(renderPostCard)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <ImageOff className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {t("app.home.empty_state.title")}
            </h3>
            <p className="text-slate-600">
              {t("app.home.empty_state.subtitle")}
            </p>
          </div>
        )}

        {/* Empty Filter State */}
        {posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <ImageOff className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {t("app.home.empty_filter.title")}
            </h3>
          </div>
        )}
      </ListView>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <AlertDialogTitle>
                {t("app.home.delete_modal.title")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {t("app.home.delete_modal.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {postToDelete && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">
                {t("app.home.delete_modal.item_label")}
              </p>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">
                {postToDelete.description}
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">
                {t("app.home.delete_modal.warning_label")}
              </span>{" "}
              {t("app.home.delete_modal.warning")}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("app.home.delete_modal.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("app.home.delete_modal.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LoadingOverlay>
  );
}
