"use client";

import { createContext } from "react";
import type { Readme } from "@/lib/readme";

/** The profile README, fetched by the root layout and shared with the README app and `cat README.md`. */
export const ReadmeContext = createContext<Readme>(null);
