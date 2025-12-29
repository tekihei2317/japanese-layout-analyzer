#!/usr/bin/env bun
import { Command } from "commander";
import { analyzeCommand } from "./commands/analyze";
import { corpusCommand } from "./commands/corpus";
import { exportCommand } from "./commands/export";
import { listLayouts, showLayout } from "./commands/layout";
import { scissorsCommand, sfbsCommand, sfssCommand } from "./commands/metrics";
import type { Format } from "./types";
import { strokeCommand } from "./commands/stroke";

const program = new Command();

program
  .name("jla")
  .description("Japanese layout analyzer CLI")
  .version("0.0.0");

program
  .command("analyze <corpusOrFile> <layout>")
  .option("--format <text|json>", "output format", "text")
  .action((corpusOrFile: string, layout: string, options: { format: Format }) => {
    analyzeCommand(corpusOrFile, layout, options).catch((error) => {
      console.error("Failed to analyze.", error);
      process.exitCode = 1;
    });
  });

program
  .command("layout <action> [layout]")
  .action((action: string, layoutId?: string) => {
    if (action === "list") {
      listLayouts()
        .then((items) => {
          if (items.length === 0) {
            console.log("No layouts found.");
            return;
          }
          console.log(items.join("\n"));
        })
        .catch((error) => {
          console.error("Failed to list layouts.", error);
          process.exitCode = 1;
        });
      return;
    }

    if (action === "show" && layoutId) {
      showLayout(layoutId).catch((error: unknown) => {
        console.error(`Failed to read layout: ${layoutId}`);
        console.error(error);
        process.exitCode = 1;
      });
      return;
    }

    console.log("Not implemented");
  });

program
  .command("corpus <action> [corpus]")
  .option("--n <2|3>", "ngram size", "2")
  .option("--count <number>", "number of rows", "10")
  .action(
    (action: string, corpusId: string | undefined, options: { n: string; count: string }) => {
      corpusCommand(action, corpusId, options).catch((error) => {
        console.error("Failed to handle corpus command.", error);
        process.exitCode = 1;
      });
    }
  );

program
  .command("sfbs <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    sfbsCommand(corpusId, layoutId, options).catch((error) => {
      console.error("Failed to run sfbs.", error);
      process.exitCode = 1;
    });
  });

program
  .command("sfss <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    sfssCommand(corpusId, layoutId, options).catch((error) => {
      console.error("Failed to run sfss.", error);
      process.exitCode = 1;
    });
  });

program
  .command("scissors <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    scissorsCommand(corpusId, layoutId, options).catch((error) => {
      console.error("Failed to run scissors.", error);
      process.exitCode = 1;
    });
  });

program
  .command("stroke <file> <layout>")
  .action((file: string, layoutId: string) => {
    strokeCommand(file, layoutId).catch((error) => {
      console.error("Failed to convert text to strokes.", error);
      process.exitCode = 1;
    });
  });

program
  .command("export")
  .option("--corpus <id|file|all>", "corpus id or file path")
  .option("--layout <id|all>", "layout id")
  .option("--out-dir <dir>", "output directory", "web/public/metrics")
  .option("--corpus-id <id>", "override corpus id (single corpus only)")
  .option("--corpus-name <name>", "override corpus name (single corpus only)")
  .action((options: { corpus?: string; layout?: string; outDir?: string; corpusId?: string; corpusName?: string }) => {
    exportCommand(options).catch((error) => {
      console.error("Failed to export metrics.", error);
      process.exitCode = 1;
    });
  });

program.parse(process.argv);
