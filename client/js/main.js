// import $ from 'jquery';
"use strict";

import Util from './util';
import Allocator from './allocation'
import TextChangeProcessor from './textChangeProcessor';
import LocalUpdatesTransformer from './localUpdatesTransformer';
import RemoteUpdateListener from './RemoteUpdateListener';
import ReconnectingWebSocket from 'learn-reconnecting-websocket';
import RequestHelper from './requestHelper';
import Queuer from './queuer';

let ws = new ReconnectingWebSocket("ws://localhost:8080");
ws.onopen = function() {
	ws.send(RequestHelper.registrationRequest("global", 0));
}
let queuer = new Queuer(ws);
let allocator = new Allocator();
let textChangeProcessor = new TextChangeProcessor(allocator);
let localUpdatesTransformer = new LocalUpdatesTransformer(textChangeProcessor, queuer);
let remoteUpdateListener = new RemoteUpdateListener(textChangeProcessor, ws);

console.log("Initializing the main code");

function startListeningForUpdate(editor) {
	editor.on("change", function(cm, change) {
		if(change.origin !== "remoteEdit") {
			localUpdatesTransformer.sendUpdate(change);
		}
	});
	window.siteId = Util.getRandomInteger(1, 1000000);
	remoteUpdateListener.startListeningForUpdates(localUpdatesTransformer, editor);
}

window.startListeningForUpdate = startListeningForUpdate;