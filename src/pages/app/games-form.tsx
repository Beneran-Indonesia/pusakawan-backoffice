import { GameDetails, GameDetailsSchema } from "@/types/app/app-game-details-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@refinedev/core";
import { useForm } from "react-hook-form";

export default function AppGamesForm() {
  // 1. URL /app/games/create = new
  // URL /app/games/edit/:id

  const pathname = location.pathname;

  // if pathname includes "edit", get the id.

  // once we got the ID, useOne to get all of the form values.


  // form:
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<GameDetails>({
      resolver: zodResolver(GameDetailsSchema),
      // defaultValues,
    });
  

  const t = useTranslate();
  return <></>;
}
