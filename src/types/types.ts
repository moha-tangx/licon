import { Stats, statSync } from "node:fs";
import { join, parse } from "node:path";

export class Entry {
  icon: string;
  size: string;
  type: string;
  name: string;
  icon_color: string;
  group: string;
  owner: string;
  baseEnt: Stats;
  parentPath: string;
  constructor(
    name: string,
    parentPath = "",
    icon = "",
    color = "",
    size = "",
    group = "",
    owner = "",
    type = ""
  ) {
    this.icon = icon;
    this.type = type;
    this.name = parse(join(parentPath, name)).base;
    this.size = size;
    this.group = group;
    this.icon_color = color;
    this.owner = owner;
    this.parentPath = parentPath;
    this.baseEnt = statSync(join(parentPath, name));
  }
  isDirectory(): boolean {
    return this.baseEnt.isDirectory();
  }
  print() {
    const reset = "\x1B[0m";
    const ent = `${this.group}${this.owner}${this.size}${this.icon_color}${this.icon} ${reset}${this.name}${this.type}`;
    console.log(ent);
  }
}

export type Config = {
  [name: string]: { char: string; extentions?: string[]; color?: string };
};

export type Options = {
  [option: string]: {
    selected: boolean | string;
    action: ((...args: any[]) => any | void) | null;
  };
};

export type Flags = {
  [flag: string]: { option: keyof Options; args?: string[]; desc: string };
};
