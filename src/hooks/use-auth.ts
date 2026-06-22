import { UserToken } from "@/types/users";
import * as React from "react";

export const UserContext = React.createContext<null | UserToken>(null);