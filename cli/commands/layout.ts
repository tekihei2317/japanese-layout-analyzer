import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const layoutsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "core",
  "layouts"
);

export const listLayouts = async () => {
  const entries = await fs.readdir(layoutsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.replace(/\.json$/, ""))
    .sort();
};

export const showLayout = async (layoutId: string) => {
  const fileName = layoutId.endsWith(".json") ? layoutId : `${layoutId}.json`;
  const filePath = path.join(layoutsDir, fileName);
  const contents = await fs.readFile(filePath, "utf8");
  const entries = JSON.parse(contents) as Array<{
    input: string;
    output: string;
    nextInput?: string;
  }>;

  console.log(`layout: ${layoutId}`);
  console.log(`entries: ${entries.length}`);
  console.log("");
  console.log("sample:");
  entries.slice(0, 10).forEach((entry) => {
    const nextInput = entry.nextInput ? ` -> ${entry.nextInput}` : "";
    console.log(`  ${entry.input} => ${entry.output}${nextInput}`);
  });
};
