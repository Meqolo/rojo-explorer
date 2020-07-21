// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { default: Axios } = require('axios');
const fs = require('fs');
const classIcons = JSON.parse(fs.readFileSync(__dirname + '/assets/classes.json', 'utf-8'))

let Instances = {}
let RojoInstances = {}
let url = ''

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function RunCode() {}

class TreeItem extends vscode.TreeItem {

	constructor(label, children) {
	  super(
		  label,
		  children === undefined ? vscode.TreeItemCollapsibleState.None :
								   vscode.TreeItemCollapsibleState.Collapsed);
	  this.children = children;
	}
  }

class TreeDataP {
  constructor(outline) {
	this.outline = outline;
  }

  getTreeItem(item) {
	let TreeItem = new vscode.TreeItem(
		item.label,
		item.children.length > 0
		  ? vscode.TreeItemCollapsibleState.Collapsed
		  : vscode.TreeItemCollapsibleState.None
	);
	TreeItem.iconPath = `${__dirname}/assets/classes/tile${item.icon}.png`

	switch (RojoInstances[item.id].ClassName) {
		case "Script":
		case "LocalScript":
		case "ModuleScript":
		TreeItem.command = {command: 'rojo-explorer.openFile', title: 'Opens File', arguments: [item.id]}
	}

    return TreeItem
  }

  getChildren(element) {
    if (element) {
      return Promise.resolve(element.children);
    } else {
      return Promise.resolve(this.outline);
    }
  }
}



/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rojo-explorer" is now active!');

	
	let disposable = vscode.commands.registerCommand('rojo-explorer.open', function () {
		// The code you place here will be executed every time your command is executed
		let TreeData = []

		function Start() {
			vscode.window.showInputBox({placeHolder: "localhost:34872", prompt: "Address that rojo server is listening to"}).then(result => {
				let string = result

				if (!result || result.length < 1) {
					result = "localhost:34872"
				}
				if (result.charAt(result.length - 1) != '/') {
					result = result + '/'
				}
				if (result.substring(1, 8) != 'http://') {
					result = "http://" + result
				}
				
				if (result.search(':')) {
					url = result
					Axios.get(url + "api/rojo").then( response => {
						let data = response.data
						
						Axios.get(`${url}api/read/${data.rootInstanceId}`).then(response => {
							Instances = {
								label: response.data.instances[data.rootInstanceId].Name,
								icon: '025',
								id: data.rootInstanceId,
								children : [

								]
							}

							RojoInstances = response.data.instances

							function GetInstances(parent, treething) {
								for (let key in parent.Children) {
									let obj = response.data.instances[parent.Children[key]]

									let data = {
										label: obj.Name,
										icon: String(classIcons[obj.ClassName] - 1).padStart(3, '0'),
										id: obj.Id,
										children: []
									}

									let b;
									
									if (obj.ClassName == 'Workspace') {
										treething.splice(0, 0, data);
										b = 1;
									} else {
										b = treething.push(data)
									}
									
									GetInstances(obj, treething[b - 1].children)
								}
							}

							GetInstances(response.data.instances[data.rootInstanceId], Instances.children)

							vscode.window.createTreeView("RojoExplorer", { 
								treeDataProvider: new TreeDataP([Instances])
							})

							const completionProvider = vscode.languages.registerCompletionItemProvider('lua', {
								provideCompletionItems(document, position, token, context) {
									const textSplit = document.lineAt(position.line).text.substr(0, position.character).split('.')
									const text = textSplit[textSplit.length - 1]
									
									let CompletionItems = []
									let Completed = []

									const gameCompletion = new vscode.CompletionItem('game');

									function GetChildFromParent(parent, treething) {
										for (let key in parent) {
											let obj = parent[key]
											
											for (let key2 in textSplit) {
												if (Number(key2) > 0) {
													if (parent[key].label == textSplit[key2]) {
														GetChildFromParent(parent[key].children)
													} else if (parent[key].label.toLowerCase().startsWith(text.toLowerCase())) {
														if (Completed.includes(parent[key].label) == false) {
															const Completion = new vscode.CompletionItem(parent[key].label);
															CompletionItems.push(Completion)
															Completed.push(parent[key].label)
														}
													}
												}
											}
										}
									}
									
									if (textSplit.length <= 1 && text.startsWith('g')) {
										CompletionItems.push(gameCompletion)
									} else if (textSplit.length > 1) {
										GetChildFromParent(Instances.children)
									}

									// console.log(document, position, context)
									// const localCompletion = new vscode.CompletionItem('local');

									return CompletionItems
								}
							})
						}).catch(err => {
							console.error(err)
						})
					}).catch(err => {
						console.error(err)
						vscode.window.showErrorMessage('An error occurred while launching the explorer. Is the rojo server started?')
					})
				} else {
					Start()
				}
			})
		}

		Start()
		

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from Rojo Explorer!');
	});

	let disposable2 = vscode.commands.registerCommand('rojo-explorer.openFile', function (id) {
		Axios.post(`${url}api/open/${id}`).catch(err => {
			vscode.window.showErrorMessage(`Rojo Explorer had an error while attempting to open item ${id}, refer to debug console for more information`)
			console.log(err);
			console.log(`RojoExplorer error, item info-`)
			console.log(RojoInstances[id])

		})
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
