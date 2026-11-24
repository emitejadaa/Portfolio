"use client";

import type { DeploysResponse, GitHubResponse, ReadmeResponse, StatusResponse } from "@/lib/api-types";
import { getJson, useApi } from "./hooks";

export const useGitHub = () => useApi<GitHubResponse>("/api/github", 30 * 60 * 1000);
export const useStatus = () => useApi<StatusResponse>("/api/status", 5 * 60 * 1000);
export const useDeploys = () => useApi<DeploysResponse>("/api/deploys", 10 * 60 * 1000);

/** The profile README is fetched only when the README window or `cat README.md` asks for it. */
const README_URL = "/api/readme";
const README_TTL = 24 * 60 * 60 * 1000;
export const useReadme = () => useApi<ReadmeResponse>(README_URL, README_TTL);
export const loadReadme = () => getJson<ReadmeResponse>(README_URL, README_TTL);
