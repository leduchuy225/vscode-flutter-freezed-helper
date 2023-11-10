<!-- # Flutter Freezed Helpers VSCode Extension

This extension currently helps you to easily write `freezed` annotated classes and allows you to run code generation for those classes. You can also watch the files so that code generation is faster.

👉 <https://marketplace.visualstudio.com/items?itemName=mthuong.vscode-flutter-freezed-helper>

## Setup your flutter project for code generation for JSONSerializable annotations

In your `pubspec.yaml` file add the following libraries in the `dev_dependencies` and `dependencies` section:

```ruby
dev_dependencies:
    // ...
    build_runner:
    freezed:
    json_serializable:

dependencies:
    // ...
    freezed_annotation:
    json_annotation:
```

## Features

### Snippet for setting up a file with freezed annotated classes: `frf`

![frf](media/frf.gif)

### Snippet for creating freezed annotated model: `frc`

![frc](media/frc.gif)

### Run Code Gen for freezed annotated classes

![code gen](media/build.gif)

### Have build runner watch the freezed annotated classes and generate code on changes

## Credits

The idea for this extension came from aksharpatel47's extension <https://github.com/aksharpatel47/vscode_flutter_helper> -->
