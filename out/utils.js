import { exit } from "node:process";
import { log as print } from "node:console";
const COLORS = {
    RESET: "\x1B[0m",
    RED: "\x1B[38;5;1m",
    BLUE: "\x1B[38;5;4m",
    GRAY: "\x1B[38;5;8m",
    WHITE: "\x1B[B8;5;15m",
    GREEN: "\x1B[38;5;2m",
    ORANGE: "\x1B[38;5;3m",
    PURPLE: "\x1B[38;5;5m",
    MAGENTA: "\x1B[38;5;6m",
    YELLOW: "\x1B[38;5;190m",
    OFF_WHITE: "\x1B[38;5;7m",
    DEFAULT_FILE: "\x1B[38;5;4m",
    DEFAULT_DIRECTORY: "\x1B[38;5;4m",
};
export function getColor(color) {
    return color.startsWith("$") ? COLORS[color.substring(1).toUpperCase()] : color;
}
export function badOptionMessage(prog_name, passed_opt) {
    print(`${prog_name}: invalid  option -- '${passed_opt}'
Try ${prog_name} --help for more information`);
    exit(1);
}
export function badArgumentMessage(prog_name, passed_opt, required) {
    print(`${prog_name}: option --'${passed_opt} ${!required && "does not allow"} ${required && "requires"} an argument'
Try ${prog_name} --help for more information`);
    exit(1);
}
export function usageMessage(FLAGS) {
    print(`
  Usage: licon [OPTION]... [FILE]...
  list information about the FILEs with ICONS.
  `);
    // to get the longest flag name
    let len = Object.keys(FLAGS).map((f) => f.length).reduce((p, v) => v > p ? v : p);
    for (let opt in FLAGS) {
        // print("in loop")
        // meaning: it's a short 
        let desc = FLAGS[opt].desc;
        desc = desc.padStart(desc.length - opt.length + len);
        if (opt.length < 2) {
            print(`  -${opt} ${desc}`);
            continue;
        }
        // meaning: it needs argument
        if (FLAGS[opt].args?.length > 0) {
            print(`  --${opt}=${opt} ${FLAGS[opt].desc}`);
            continue;
        }
        // long but does not need argument
        print(`  --${opt}${desc}`);
    }
    exit(0);
}
