// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { default: Axios } = require('axios');
const fs = require('fs');
const classIcons = JSON.parse(fs.readFileSync(__dirname + '/assets/classes.json', 'utf-8'))

let Instances = {}

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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rojo-explorer.open', function () {
		// The code you place here will be executed every time your command is executed
		let url = ''
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
								children : [

								]
							}

							function GetInstances(parent, treething) {
								for (let key in parent.Children) {
									let obj = response.data.instances[parent.Children[key]]
									console.log(key, obj)//response.data.instances[key])
									let b = treething.push({
										label: obj.Name,
										icon: String(classIcons[obj.ClassName] - 1).padStart(3, '0'),
										children: []
									})
									if (obj.ClassName == "Workspace") {
										var a = treething[0];
										treething[0] = treething[b - 1];
										treething[b - 1] = a;
									}
									GetInstances(obj, treething[b - 1].children)
								}
							}

							GetInstances(response.data.instances[data.rootInstanceId], Instances.children)
							


							// let TDP = new TreeDataProvider()
						

							// async () => {
								// vscode.window.registerTreeDataProvider("RojoExplorer",
								// new TreeDataP([dataObject]))
							// }

							vscode.window.createTreeView("RojoExplorer", { 
								treeDataProvider: new TreeDataP([Instances])
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

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
