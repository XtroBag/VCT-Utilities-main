import { readdir } from "node:fs/promises";

const Data = {
  folders: [],
};

const MainDirectory = await readdir("./src/Photos", { encoding: "utf8" });
const FilteredArray = MainDirectory.filter((f) => !f.endsWith(".js"));
for (const Folder of FilteredArray) {
  switch (Folder) {
    case "Bot":
      const BotDirectory = await readdir(`./src/Photos/${Folder}`);
      for (const Folders of BotDirectory) {
        const BotFiles = await readdir(`./src/Photos/${Folder}/${Folders}`);
        for (const File of BotFiles) {
          const Path = `./src/Photos/${Folder}/${Folders}/${File}`;
          // [ERROR: Cannot read property of undefined (reading 'path') ]
          // Fix this by making sure you entered the right photo name in the grab function
          Data.folders.push({
            directory: Folder,
            subdirectory: Folders,
            file: File,
            path: Path,
          });
        }
      }
      break;
  }
}

export function GrabPhoto(file) {
  const grabbed = Data.folders.find((f) => f.file === file);
  return grabbed.path;
}
