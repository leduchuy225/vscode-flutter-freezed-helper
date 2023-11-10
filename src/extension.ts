// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { exec, spawn } from "child_process";

const handleFileName = (name: string) => {
  const partName = name.split(".");
  partName.splice(partName.length - 1, 0, "*");

  return partName.join(".");
};

// const handleOutput = (data: string) => {
//   const partData = data.split("\n");
//   return partData[partData.length - 1];
// };

export function deactivate() {}

export function activate(context: vscode.ExtensionContext) {
  const buildRunnerSingleFile = (uri: vscode.Uri) => {
    console.log(uri);

    const filePath = uri.fsPath;

    const libIndex = filePath.indexOf("lib/");

    const path = filePath.substring(libIndex);
    const partition = path.split("/");
    const fileName = handleFileName(partition[partition.length - 1]);

    partition.pop();
    partition.push(fileName);

    const newPath = partition.join("/");

    console.log(vscode.workspace.workspaceFile);

    const cwd = filePath.substring(0, libIndex);

    console.log(cwd);
    console.log(newPath);

    // exec(
    //   `${cwd} flutter pub run build_runner build --delete-conflicting-outputs --build-filter='${newPath}'`,
    //   (err, stdout, stderr) => {
    //     console.log("stdout: " + stdout);
    //     if (stderr) {
    //       vscode.window.showErrorMessage(stderr);
    //     }
    //     if (err) {
    //       console.log("error: " + err);
    //     }
    //   }
    // );

    const process = spawn(
      `flutter pub run build_runner build --delete-conflicting-outputs --build-filter='${newPath}'`,
      { shell: true, cwd: cwd }
    );
    process.stdout.on("data", (data) => {
      vscode.window.showInformationMessage(data);
    });
    process.stderr.on("data", (data) => {
      vscode.window.showErrorMessage(data);
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "flutterBuildRunnerHelper.buildRunnerSingleFile",
      (clickedFile: vscode.Uri) => {
        buildRunnerSingleFile(clickedFile);
      }
    )
  );
}
