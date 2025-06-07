import { statSync } from "node:fs";
import { join } from "node:path";
export class Entry {
    icon;
    size;
    type;
    name;
    color;
    group;
    owner;
    baseEnt;
    parentPath;
    constructor(name, parentPath = "", icon = "", color = "", size = "", group = "", owner = "", type = "") {
        this.icon = icon;
        this.type = type;
        this.name = name;
        this.size = size;
        this.group = group;
        this.color = color;
        this.owner = owner;
        this.parentPath = parentPath;
        this.baseEnt = statSync(join(parentPath, name));
    }
    isDirectory() {
        return this.baseEnt.isDirectory();
    }
    print() {
        const reset = "\x1B[0m";
        const ent = `${this.group}${this.owner}${this.size}${this.color}${this.icon} ${reset}${this.name}${this.type}`;
        console.log(ent);
    }
}
