"use client";

import type { DeploysResponse, GitHubResponse, StatusResponse } from "@/lib/api-types";
import { useApi } from "./hooks";

export const useGitHub = () => useApi<GitHubResponse>("/api/github", 30 * 60 * 1000);
export const useStatus = () => useApi<StatusResponse>("/api/status", 5 * 60 * 1000);
export const useDeploys = () => useApi<DeploysResponse>("/api/deploys", 10 * 60 * 1000);
