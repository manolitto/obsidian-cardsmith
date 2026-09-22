import { Platform, type Workspace, type WorkspaceLeaf } from "obsidian";
import type { OpenTarget } from "../settings/types";

/**
 * A fresh leaf where the *Open in* preference says: beside the active
 * leaf, in its tab group, or in a popout window. A phone has no windows,
 * so there the window preference opens a tab instead of nothing.
 */
export function newLeaf(workspace: Workspace, target: OpenTarget): WorkspaceLeaf {
  switch (target) {
    case "tab":
      return workspace.getLeaf("tab");
    case "split-right":
      return workspace.getLeaf("split", "vertical");
    case "split-down":
      return workspace.getLeaf("split", "horizontal");
    case "window":
      return workspace.getLeaf(Platform.isMobile ? "tab" : "window");
  }
}
