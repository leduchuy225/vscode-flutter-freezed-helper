// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs";
import * as vscode from "vscode";
import { spawn } from "child_process";

const handleFileName = (name: string, isFolder: boolean) => {
  if (isFolder) {
    return name + "/**";
  }

  const partName = name.split(".");
  partName.splice(partName.length - 1, 0, "*");

  return partName.join(".");
};

const handleOutput = (data: string) => {
  const partData = data.split("[INFO]");
  return partData[partData.length - 1].trim();
};

export function deactivate() {}

export function activate(context: vscode.ExtensionContext) {
  const buildRunnerOnClick = (uri: vscode.Uri) => {
    console.log(uri);

    const isForlder = fs.lstatSync(uri.fsPath).isDirectory();

    const filePath = uri.fsPath;

    const libIndex = filePath.indexOf("lib/");

    const path = filePath.substring(libIndex);
    const partition = path.split("/");

    const fileName = handleFileName(partition[partition.length - 1], isForlder);

    partition.pop();
    partition.push(fileName);

    const newPath = partition.join("/");

    const cwd = filePath.substring(0, libIndex);

    console.log(cwd);
    console.log(newPath);

    vscode.window.withProgress(
      {
        cancellable: false,
        title: "Build_runner is running...",
        location: vscode.ProgressLocation.Notification,
      },
      async (
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        _: vscode.CancellationToken
      ) => {
        progress.report({ increment: 0 });

        const process = spawn(
          `flutter pub run build_runner build --build-filter='${newPath}'`,
          { shell: true, cwd: cwd }
        );

        let result = "";
        process.stdout.on("data", (data) => {
          progress.report({ message: data.toString() });
          result += data.toString();
        });
        process.on("close", (_) => {
          console.log(result);

          progress.report({ increment: 100 });
          vscode.window.showInformationMessage(handleOutput(result));
        });
      }
    );
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "flutterBuildRunnerHelper.buildRunnerOnClick",
      (clickedFile: vscode.Uri) => {
        buildRunnerOnClick(clickedFile);
      }
    )
  );
}
