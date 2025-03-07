/**
 * IBM Cloud Schematics
 * (C) Copyright IBM Corp. 2021 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';

import * as api from '../../api';
import LogsView from '../../webview/workspace/LogsView';
import * as util from '../../util';

export async function log(
    context: vscode.ExtensionContext,
    data: any
): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        let jobID = data;

        if (!jobID) {
            let jobs: any = await api.getWorkspaceJobs();
            let jobsList = jobs?.actions.map((action: any) => {
                const stv = `${action.name}_${action.status}`;
                return (
                    util.status.getActivtyStatus(stv) + ': ' + action.action_id
                );
            });

            const jobPicked: any = await util.userInput.showJobsQuickPick(
                jobsList
            );

            jobID = jobPicked.split(': ')[1];
        }

        const logsView = new LogsView(context, jobID);
        logsView.openView(true);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export function latestLog(context: vscode.ExtensionContext): void {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const logsView = new LogsView(context, '');
        logsView.openView(true);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}
