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

    const notification = vscode.window.setStatusBarMessage(
      "$(loading) Build_Runner is running..."
    );

    const process = spawn(
      `flutter pub run build_runner build --build-filter='${newPath}'`,
      { shell: true, cwd: cwd }
    );

    let stderrOnData = "";
    process.stderr.on("data", (error) => {
      stderrOnData += error;
      console.log("stderr on data", error.toString());
    });

    let result = "";
    process.stdout.on("data", (data) => {
      result += data.toString();
    });
    process.on("close", (_) => {
      notification.dispose();

      if (stderrOnData) {
        console.log("stderrOnData", stderrOnData);
        vscode.window.showErrorMessage(stderrOnData);
      }
      if (result) {
        console.log("stdoutOnData", result);
        vscode.window.showInformationMessage(handleOutput(result));
      }
    });
  };

  const runFlutterPubGet = (uri: vscode.Uri) => {
    console.log(uri);

    const filePath = uri.fsPath;
    const libIndex = filePath.indexOf("lib/");

    const cwd = filePath.substring(0, libIndex);

    const notification = vscode.window.setStatusBarMessage(
      "$(loading) Pub_Get is running..."
    );

    const process = spawn("flutter pub get", { shell: true, cwd: cwd });

    let stderrOnData = "";
    process.stderr.on("data", (error) => {
      stderrOnData += error;
      console.log("stderr on data", error.toString());
    });

    let result = "";
    process.stdout.on("data", (data) => {
      result += data.toString();
    });
    process.on("close", (_) => {
      notification.dispose();

      if (stderrOnData) {
        console.log("stderrOnData", stderrOnData);
        vscode.window.showErrorMessage(stderrOnData);
      }
      if (result) {
        console.log("stdoutOnData", result);
        vscode.window.showInformationMessage(handleOutput(result));
      }
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "flutterBuildRunnerHelper.buildRunnerOnClick",
      (clickedFile: vscode.Uri) => {
        buildRunnerOnClick(clickedFile);
      }
    ),
    vscode.commands.registerCommand(
      "flutterBuildRunnerHelper.pubGetOnClick",
      (clickedFile: vscode.Uri) => {
        runFlutterPubGet(clickedFile);
      }
    )
  );
}
