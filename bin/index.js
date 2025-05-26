import { argv, exit } from "node:process";
import { log as print } from "node:console";
import { readdir } from "node:fs/promises";
const PASSED_ARGS = argv.slice(2);
const SELECTED_OPIONS = {
    all: { selected: false, action: (entries) => { return entries.map(e => !e.name.startsWith(".")); } },
    long: { selected: false, action: (entries) => { return entries; } },
    colored: { selected: true, action: (entries) => { return entries; } },
    vertical: { selected: false, action: (entries) => { return entries; } },
    recursive: { selected: false, action: (entries) => { return entries; } },
    show_type: { selected: false, action: (entries) => { return entries; } },
    show_size: { selected: false, action: (entries) => { return entries; } },
    show_class: { selected: false, action: (entries) => { return entries; } },
    almost_all: { selected: false, action: (entries) => { return entries; } },
    show_owner: { selected: false, action: (entries) => { return entries; } },
    show_group: { selected: false, action: (entries) => { return entries; } },
    show_author: { selected: false, action: (entries) => { return entries; } },
    formart: { selected: "horizontal", action: (entries) => { return entries; } },
    make_human_readable: { selected: false, action: (entries) => { return entries; } },
};
const SELECTED_PATHS = [];
const AVAILABLE_OPTIONS = {
    "help": { set: () => { usageMessage(); }, desc: "shows this help message" },
    "l": { set: () => { SELECTED_OPIONS.long.selected = true; }, desc: "long list" },
    "file-type": { set: () => { SELECTED_OPIONS.show_type.selected = true; }, desc: "" },
    "classify": { set: () => { SELECTED_OPIONS.show_class.selected = true; }, desc: "" },
    "R": { set: () => { SELECTED_OPIONS.recursive.selected = true; }, desc: "recursive" },
    "a": { set: () => { SELECTED_OPIONS.all.selected = true; }, desc: "list all content" },
    "A": { set: () => { SELECTED_OPIONS.almost_all.selected = true; }, desc: "almost all" },
    "g": { set: () => { SELECTED_OPIONS.show_group.selected = true; }, desc: "show group" },
    "s": { set: () => { SELECTED_OPIONS.show_size.selected = true; }, desc: "show file size" },
    "x": { set: () => { SELECTED_OPIONS.vertical.selected = false; }, desc: "print horiontaly" },
    "F": { set: () => { SELECTED_OPIONS.show_class.selected = true; }, desc: "show file type " },
    "1": { set: () => { SELECTED_OPIONS.vertical.selected = true; }, desc: "list in one column" },
    "author": { set: () => { SELECTED_OPIONS.show_author.selected = true; }, desc: "show author" },
    "fomart": {
        set: (fomart) => { SELECTED_OPIONS.formart.selected = fomart; }, desc: "set printing fomart",
        options: ["across", "commas", "horizonatl", "long", "vertical", "verbose"]
    }
};
function badOptionMessage(prog_name, passed_opt) {
    print(`${prog_name}: invalid  option -- '${passed_opt}'
Try ${prog_name} --help for more information`);
    exit(1);
}
function badArgumentMessage(prog_name, passed_opt, required) {
    print(`${prog_name}: option --'${passed_opt} ${!required && "does not allow"} ${required && "requires"} an argument'
Try ${prog_name} --help for more information`);
    exit(1);
}
function usageMessage() {
    print(`
  Usage: licon [OPTION]... [FILE]...
  list information about the FILEs with ICONS.
`);
    for (let opt in AVAILABLE_OPTIONS) {
        // print("in loop")
        // meaning: it's a short 
        if (opt.length < 2) {
            print(`  -${opt}      ${AVAILABLE_OPTIONS[opt].desc}`);
            continue;
        }
        // meaning: it needs argument
        if (AVAILABLE_OPTIONS[opt].set.length > 0) {
            print(`  --${opt}=${opt} ${AVAILABLE_OPTIONS[opt].desc}`);
            continue;
        }
        // long but does not need argument
        print(`  --${opt}     ${AVAILABLE_OPTIONS[opt].desc}`);
    }
    exit(0);
}
function setSelectedOptions(passed_args) {
    const entries = passed_args.filter(arg => !arg.startsWith("-")).filter(entry => entry.trim() !== "");
    const fulls = passed_args.filter(arg => arg.startsWith("--")).map(arg => arg.slice(2).split("="));
    const shorts = passed_args.filter(arg => arg.startsWith("-") && !arg.startsWith("--")).flatMap(arg => arg.slice(1).split(""));
    //set shorts first --they have less priority
    for (const short of shorts) {
        if (!AVAILABLE_OPTIONS[short])
            badOptionMessage("licon", short);
        AVAILABLE_OPTIONS[short].set();
    }
    //then set fulls
    for (const full of fulls) {
        const [option, argument] = full;
        if (!AVAILABLE_OPTIONS[option])
            badOptionMessage("licon", option);
        //meaning: it needs an argument 
        if (AVAILABLE_OPTIONS[option].set.length > 0) {
            //if argument is not passed
            if (!argument.trim())
                badArgumentMessage("licon", option, false);
            //if not a valid argument
            if (AVAILABLE_OPTIONS[option].options.includes[argument.trim()])
                print(`invalid --${option} argument ${argument}`);
            // if everything OK 👍🏿 set option=argument in options
            else
                AVAILABLE_OPTIONS[option].set(argument);
        }
        //meaning:full does not needs an argument
        else {
            //if argument passed
            if (argument)
                badArgumentMessage("licon", option, false);
            AVAILABLE_OPTIONS[option].set();
        }
    }
    //if directories to be read are given
    if (entries.length)
        for (let i = 0; i < entries.length; i++)
            SELECTED_PATHS[i] = entries[i];
    // if directory is not selected we read the current (.) directory
    else
        SELECTED_PATHS[0] = ".";
}
setSelectedOptions(PASSED_ARGS);
async function ListEntries(selections) {
    for (const selection of selections) {
        let entries = await readdir(selection, { recursive: SELECTED_OPIONS.recursive.selected, withFileTypes: SELECTED_OPIONS.show_class.selected });
        for (const key in SELECTED_OPIONS) {
            const option = SELECTED_OPIONS[key];
            entries = option.selected ? option.action(entries) : entries;
        }
        entries.forEach(entry => print(entry));
        print("");
    }
}
ListEntries(SELECTED_PATHS);
