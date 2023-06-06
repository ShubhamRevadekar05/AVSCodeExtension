import * as vscode from 'vscode';
import * as onedoescompile from './subextensions/onedoescompile';
import * as runner from './subextensions/runner';
import * as plagiarism_checker from './subextensions/plagiarism-checker';
import * as pdf_viewer from './subextensions/pdf-viewer';

export function activate(context: vscode.ExtensionContext) {
	onedoescompile.activate(context);
	runner.activate(context);
	plagiarism_checker.activate(context);
	pdf_viewer.activate(context);
}

export function deactivate() {
	onedoescompile.deactivate();
	runner.deactivate();
	plagiarism_checker.deactivate();
}
