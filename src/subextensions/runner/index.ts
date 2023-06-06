import * as vscode from 'vscode';
import * as path from 'path';

let langsConfig = new Map([["ABAP","abap"],["Windows Bat","bat"],["BibTeX","bibtex"],["Clojure","clojure"],["Coffeescript","coffeescript"],["C","c"],["C++","cpp"],
	["C#","csharp"],["CUDA C++","cuda-cpp"],["CSS","css"],["Diff","diff"],["Dockerfile","dockerfile"],["F#","fsharp"],["Git","git-commit"],["Go","go"],
	["Groovy","groovy"],["Handlebars","handlebars"],["Haml","haml"],["HTML","html"],["Ini","ini"],["Java","java"],["JavaScript","javascript"],["JavaScript React","javascriptreact"],
	["JSON","json"],["JSON with Comments","jsonc"],["LaTeX","latex"],["Less","less"],["Lua","lua"],["Makefile","makefile"],["Markdown","markdown"],["Objective-C","objective-c"],
	["Objective-C++","objective-cpp"],["Perl","perl"],["PHP","php"],["Plain Text","plaintext"],["PowerShell","powershell"],["Pug","jade"],["Python","python"],["R","r"],
	["Razor (cshtml)","razor"],["Ruby","ruby"],["Rust","rust"],["SCSS","scss"],["ShaderLab","shaderlab"],["Shell Script (Bash)","shellscript"],["Slim","slim"],["SQL","sql"],
	["Stylus","stylus"],["Swift","swift"],["TypeScript","typescript"],["TypeScript React","typescriptreact"],["TeX","tex"],["Visual Basic","vb"],["Vue","vue"],["Vue HTML","vue-html"],
	["XML","xml"],["XSL","xsl"],["YAML","yaml"]].map(element => {
	return [element[1], element];
}));

class CommandPickItem implements vscode.QuickPickItem {
	commandMap : any;
	label : string;
	detail : string;
	constructor(commandMap : any) {
		this.commandMap = commandMap;
		this.label = commandMap.name;
		this.detail = commandMap.command;
	}
}

export function activate(context: vscode.ExtensionContext) {
	let htmlGenerator = function(mappings: Array<any>, staticUris : Array<any> | undefined) {
		let commandRowsHTML = "";
		mappings?.forEach(element => {
			let langTagHTML = "";
			commandRowsHTML += "<tr>";
			element.language_tags.split(" ").forEach((tag: any) => {
				langTagHTML += `<button class="btn btn-sm btn-outline-warning mx-auto mx-md-1 m-1" disabled>${langsConfig.get(tag)?.[0]}</button>`;
			});
			commandRowsHTML += `<td>${element.name}</td><td>${element.command}</td><td>${langTagHTML}</td><td><button class="btn btn-danger" onClick="remove('${element.id}')">Remove</button></td>`
			commandRowsHTML += "</tr>";
		});
		let languageRowsHTML = "";
		langsConfig.forEach(element => {
			languageRowsHTML += `<option value="${element[1]}">${element[0]}</option>`;
		});
		return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Commands Mappings</title>
				<link href="${staticUris?.[0]}" rel="stylesheet">
			</head>
			<body class="bg-dark">
				<div class="container">
					<div class="row mb-2">
						<div class="col-sm-6">
							<form id="form" class="text-light">
								<label class="col-form-label">Name:</label>
								<input class="form-control" type="text" id="name" placeholder=""></input>
								<label class = "col-form-label">Command:</label>
								<textarea class="form-control" id="command"></textarea>
								<label class="col-form-label">Language tags:</label>
								<select class="form-select" id="language_tags" multiple>${languageRowsHTML}</select><br>
								<button class="btn btn-primary" type="submit" id="submit">Add</button>
							</form>
							<script>
								const vscodeApi = acquireVsCodeApi();
								var form = document.getElementById("form");
								form.onsubmit = function(evt) {
									evt.preventDefault();
									var name = document.getElementById("name");
									var command = document.getElementById("command");
									var language_tags = [...document.getElementById("language_tags").selectedOptions].map(option => option.value).join(" ");
									vscodeApi.postMessage({
										action: 'add',
										name: name.value ? name.value : "",
										command: command.value ? command.value : "",
										language_tags: language_tags
									});
									return false;
								}
								const remove = function(id) {
									vscodeApi.postMessage({
										action: 'remove',
										id: id
									});
								}
							</script>
						</div>
						<div class="table-responsive col-sm-6">
							<table class="table table-dark table-hover">	
								<th>Name</th>
								<th>Command</th>
								<th>Language tags</th>
								<th></th>
								${commandRowsHTML}
							</table>
						</div>
					</div>
				</div>
			</body>
		</html>`
	};
	if(!context.globalState.get("Runner.mappings")) {
		context.globalState.update("Runner.mappings", []);
		context.globalState.setKeysForSync(["Runner.mappings"]);
	}
	let commandIdGenerator = function(name : string) : string {
		let randomId = name + "_" + Math.random().toString().substring(2,7);
		let mappingsArray : Array<[string, object]> | undefined = context.globalState.get("Runner.mappings");
		let mappingsMap = new Map(mappingsArray);
		if(mappingsMap.has(randomId)) randomId = commandIdGenerator(name);
		return randomId;
	}
	let addMapping = (id : string, m : Object) => {
		let mappingsArray : Array<[string, object]> | undefined = context.globalState.get("Runner.mappings");
		let mappingsMap = new Map(mappingsArray);
		mappingsMap.set(id, m);
		context.globalState.update("Runner.mappings", Array.from(mappingsMap));
	}
	let removeMapping = (id : string) => {
		let mappingsArray : Array<[string, object]> | undefined = context.globalState.get("Runner.mappings");
		let mappingsMap = new Map(mappingsArray);
		mappingsMap.delete(id);
		context.globalState.update("Runner.mappings", Array.from(mappingsMap));
	}
	let commandsMappingPanel: vscode.WebviewPanel | undefined;
	let commandDispo1 = vscode.commands.registerCommand("avscodeextension.showCommandsMapping", () => {
		if(!commandsMappingPanel) {
			commandsMappingPanel = vscode.window.createWebviewPanel("Runner.CommandsMappingPanel", "Commands Mappings", vscode.ViewColumn.Active, {enableScripts: true, localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'static/subextensions/runner/static'))]});
			let loadPanel = function() {
				if(commandsMappingPanel) {
					let mappingsArray : Array<[string, object]> | undefined = context.globalState.get("Runner.mappings");
					let mappings = mappingsArray?.map(element => element[1]);
					let cssUri = commandsMappingPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'static/subextensions/runner/static/css', 'bootstrap.min.css')));
					commandsMappingPanel.webview.html = htmlGenerator(mappings?mappings:[], [cssUri]);
				}
			}
			commandsMappingPanel.onDidDispose(() => {
				commandsMappingPanel = undefined;
		  	}, null, context.subscriptions);
			commandsMappingPanel.webview.onDidReceiveMessage(message => {
				switch(message.action) {
					case 'add':
						let commandId = commandIdGenerator(message.name);
						addMapping(commandId, {"id": commandId, "name": message.name, "command": message.command, "language_tags": message.language_tags});
						break;
					case 'remove':
						removeMapping(message.id);
						break;
				}
				loadPanel();
			});
			loadPanel();
		}
		else {
			commandsMappingPanel.reveal();
		}
	});
	let commandDispo2 = vscode.commands.registerCommand("avscodeextension.runCommand", () => {
		let mappingsArray : Array<[string, object]> | undefined = context.globalState.get("Runner.mappings");
		let docLangId = vscode.window.activeTextEditor?.document.languageId;
		let commandsToShow : any[] | undefined = [];
		if(docLangId) {
			let mappingsMap = new Map(mappingsArray);
			let recentCommand : any = mappingsMap.get(context.globalState.get("Runner.recentCommand") || "");
			mappingsMap.forEach((element : any) => {
				if(element.language_tags.split(" ").find((tag: string | undefined) => tag == docLangId)) commandsToShow?.push(element);
			});
			if(recentCommand) {
				if(recentCommand.language_tags.split(" ").find((tag: string | undefined) => tag == docLangId)) {
					commandsToShow?.splice(0, 0, commandsToShow?.splice(commandsToShow?.map(element => element.id).indexOf(context.globalState.get("Runner.recentCommand")), 1)?.[0]);
				}
				else commandsToShow?.push(recentCommand);
			}
			mappingsMap.forEach((element : any) => {
				if(!commandsToShow?.map(commandMap => commandMap.id).find(commandMapId => commandMapId == element.id)) commandsToShow?.push(element);
			});
		}
		else {
			commandsToShow = mappingsArray?.map(element => element[1]);
		}
		let quickPick = vscode.window.createQuickPick();
		quickPick.title = "Commands";
		quickPick.placeholder = "Select commands";
		quickPick.items = commandsToShow?commandsToShow.map(element => new CommandPickItem(element)):[];
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
		quickPick.onDidChangeSelection((selection : any) => {
			if(selection[0]) {
				if(selection[0].commandMap.command.includes("{{file}}")) {
					if(vscode.window.activeTextEditor && !vscode.window.activeTextEditor.document.isUntitled) {
						let file = vscode.window.activeTextEditor.document.fileName;
						if(vscode.window.terminals.length === 0) {
							let terminal = vscode.window.createTerminal();
							terminal.show();
							terminal.sendText(selection[0].commandMap.command.replaceAll('{{file}}', `"${file}"`));
						}
						else {
							let terminal = vscode.window.activeTerminal;
							terminal?.show();
							terminal?.sendText(selection[0].commandMap.command.replaceAll('{{file}}', `"${file}"`));
						}
					}
					else {
						vscode.window.showErrorMessage("No files are open!");
					}
				}
				else {
					if(vscode.window.terminals.length === 0) {
						let terminal = vscode.window.createTerminal();
						terminal.show();
						terminal.sendText(selection[0].commandMap.command);
					}
					else {
						let terminal = vscode.window.activeTerminal;
						terminal?.show();
						terminal?.sendText(selection[0].commandMap.command);
					}
				}
				quickPick.dispose();
				context.globalState.update("Runner.recentCommand", selection[0].commandMap.id);
			}
		});
	});
	context.subscriptions.push(commandDispo1);
	context.subscriptions.push(commandDispo2);
}

export function deactivate() {}