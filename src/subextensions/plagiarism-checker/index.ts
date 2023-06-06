import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
	let webpanel: vscode.WebviewPanel | undefined;
	let disposable = vscode.commands.registerCommand("avscodeextension.openWindow", () => {
		if(!webpanel) {
			webpanel = vscode.window.createWebviewPanel("plagiarism-checker.window", "Plagiarism Checker", vscode.ViewColumn.Active, {enableScripts: true, localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "static/subextensions/plagiarism-checker/frontend/build"))]});
			let loadPanel = function() {
				if(webpanel) {
					let faviconUri = webpanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "static/subextensions/plagiarism-checker/frontend/build", "favicon.ico")));
					let manifestUri = webpanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "static/subextensions/plagiarism-checker/frontend/build", "manifest.json")));
					let jsUri = webpanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "static/subextensions/plagiarism-checker/frontend/build/static/js", "main.js")));
					let cssUri = webpanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "static/subextensions/plagiarism-checker/frontend/build/static/css", "main.css")));
					webpanel.webview.html = `
					<!doctype html>
						<html lang="en">
						
						<head>
							<meta charset="utf-8" />
							<link rel="icon" href="${faviconUri}" />
							<meta name="viewport" content="width=device-width,initial-scale=1" />
							<meta name="theme-color" content="#000000" />
							<meta name="Plagiarism-Checker" content="Web site created for checking plagiarism." />
							<link rel="manifest" href="${manifestUri}" />
							<title>Plagiarism Checker</title>
							<script defer="defer" src="${jsUri}"></script>
							<link href="${cssUri}" rel="stylesheet">
						</head>
					
						<body style="background-color: #222; color: #eeeeee9f;">
							<noscript>You need to enable JavaScript to run this app.</noscript>
							<script>
								setTimeout(function(){
									const vscodeApi = acquireVsCodeApi();
									const handleSubmit = (e) => {
										e.preventDefault();
										const formData = new FormData(e.target);
										document.getElementById("submitBtn").disabled = true;
          								document.getElementById("submitBtnLoading").hidden = false;
										if(formData.get("text").split(" ").length > 15) {
											if(formData.get("text").split("").length <= 19000) {
												vscodeApi.postMessage({
													text: formData.get("text")
												});
											}
											else {
												document.getElementById("textError").hidden = false;
												document.getElementById("textError").innerText = "Maximum 19000 characters are allowed.";
												document.getElementById("submitBtn").disabled = false;
          										document.getElementById("submitBtnLoading").hidden = true;
											}
										}
										else {
											document.getElementById("textError").hidden = false;
											document.getElementById("textError").innerText = "Please enter more than 15 words to check.";
											document.getElementById("submitBtn").disabled = false;
          									document.getElementById("submitBtnLoading").hidden = true;
										}
									}
									document.getElementById("form").onsubmit = handleSubmit;
								}, 1000);
							</script>
							<div id="root"></div>
						</body>
					
					</html>`;
				}
			}
			webpanel.onDidDispose(() => {
				webpanel = undefined;
		  	}, null, context.subscriptions);
			webpanel.webview.onDidReceiveMessage(e => {
				axios.post("https://papersowl.com/plagiarism-checker-send-data", {
					is_free: false,
					plagchecker_locale: "en",
					title: "",
					text: e.text.replace(" ", "+")
				}, {
					"headers": {
						"accept": "*/*",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
						"sec-ch-ua-mobile": "?0",
						"sec-ch-ua-platform": "\"Windows\"",
						"x-requested-with": "XMLHttpRequest",
						"Referer": "https://papersowl.com/free-plagiarism-checker",
						"Referrer-Policy": "strict-origin-when-cross-origin"
					}
				}).then((res: any) => {
					console.log(res.data);
					webpanel?.webview?.postMessage({percent: res.data.percent});
				}).catch((err: any) => {console.error(err); webpanel?.webview.postMessage({error: true});});
		})
			loadPanel();
		}
		else {
			webpanel.reveal();
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
