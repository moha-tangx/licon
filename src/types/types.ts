import Entry from "./entry.js";

export default Entry

export enum Entry_type {
  FIFO = "FIFO",
  Link = "Link",
  Socket = "Socket",
  Regular = "Regular",
  Directory = "Directory",
  Executable = "Executable",
  Compressed = "Compressed",
}

export enum Entry_symbol {
  FIFO = "|",
  Link = "@",
  Socket = "=",
  Directory = "/",
  Executable = "*"
}

export const Entry_color = {
  FIFO: "$ORANGE",
  Link: "$MAGENTA",
  Regular: "$WHITE",
  Socket: "$PURPLE",
  Compressed: "$RED",
  Directory: "$BLUE",
  Executable: "$GREEN",
}

export type Config = {
  [name: string]: { icon?: string; extentions?: string[]; color?: string, icon_color?: string };
};

export type Options = {
  [option: string]: {
    selected: boolean | string;
    action?: ((...args: any[]) => any | void) | null;
  };
};

export type Flags = {
  [flag: string]: { option: keyof Options; args?: string[]; desc: string };
};
