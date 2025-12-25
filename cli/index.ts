#!/usr/bin/env bun
import { Command } from "commander";
import { listLayouts, showLayout } from "./commands/layout";

type Format = "text" | "json";

const program = new Command();

program
  .name("jla")
  .description("Japanese layout analyzer CLI")
  .version("0.0.0");

program
  .command("analyze <corpusOrFile> <layout>")
  .option("--format <text|json>", "output format", "text")
  .action(
    (corpusOrFile: string, layout: string, options: { format: Format }) => {
      void corpusOrFile;
      void layout;
      void options;
      console.log("Not implemented");
    }
  );

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
  .action((action: string, corpusId?: string) => {
    void action;
    void corpusId;
    console.log("Not implemented");
  });

program
  .command("sfbs <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    void corpusId;
    void layoutId;
    void options;
    console.log("Not implemented");
  });

program
  .command("sfss <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    void corpusId;
    void layoutId;
    void options;
    console.log("Not implemented");
  });

program
  .command("scissors <corpus> <layout>")
  .option("--count <number>", "number of rows", "10")
  .action((corpusId: string, layoutId: string, options: { count: string }) => {
    void corpusId;
    void layoutId;
    void options;
    console.log("Not implemented");
  });

program.parse(process.argv);
